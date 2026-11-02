// src/services/drugApi.js
import foodData from '../data/foodInteractions.json';

// --- FUNCTION 1: getRxCUI ---
export const getRxCUI = async (drugName) => {
  try {
    const encodedName = encodeURIComponent(drugName.trim());
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodedName}`);
    const data = await response.json();

    if (data.idGroup && data.idGroup.rxnormId && data.idGroup.rxnormId.length > 0) {
      return data.idGroup.rxnormId[0];
    }
    return null;
  } catch (error) {
    console.error("RxNorm API Error:", error);
    return null;
  }
};

// --- FUNCTION 2: checkDrugInteraction (OpenFDA) ---
export const checkDrugInteraction = async (drug1, drug2) => {
  try {
    const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${drug1}"&limit=1`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const label = data.results[0];
      
      if (label.drug_interactions) {
        const interactionText = label.drug_interactions.join(' ').toLowerCase();
        
        if (interactionText.includes(drug2.toLowerCase())) {
          const sentences = label.drug_interactions.join(' ').split('.');
          const relevantSentence = sentences.find(s => s.toLowerCase().includes(drug2.toLowerCase()));
          
          return relevantSentence ? relevantSentence.trim() + '.' : `Interaction found between ${drug1} and ${drug2}. Please consult your doctor.`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("OpenFDA Interaction Error:", error);
    return null;
  }
};

// --- FUNCTION 3: analyzeMedicines (Main Logic) ---
export const analyzeMedicines = async (medicineText) => {
  const lines = medicineText.split('\n').map(line => line.trim()).filter(line => line.length > 2);
  const cleanMeds = [];

  const ignoreWords = ['hospital', 'patient', 'doctor', 'clinic', 'name', 'age', 'sex', 'date', 'id', 'address', 'phone', 'dr.', 'advice', 'note', 'rest', 'water', 'spicy', 'check', 'mbbs', 'reg', 'bleeding', 'report', 'avoid', 'self', 'severe', 'interaction'];

  for (let line of lines) {
    const lowerLine = line.toLowerCase();
    if (ignoreWords.some(word => lowerLine.includes(word))) continue;

    if (lowerLine.includes('mg') || lowerLine.includes('ml') || lowerLine.includes('tab') || lowerLine.includes('cap') || /^\d+\./.test(line)) {
      let cleanLine = line.replace(/(tab|cap|syrup|syp|mg|ml|tablet|capsule|\.|\d+)/gi, '').trim();
      
      if (cleanLine.length > 2 && cleanLine.length < 30) {
        const words = cleanLine.split(/[-\s]/);
        const possibleMed = words[0]; 
        
        if (possibleMed.length > 3) {
          const formattedMed = possibleMed.charAt(0).toUpperCase() + possibleMed.slice(1).toLowerCase();
          cleanMeds.push(formattedMed);
        }
      }
    }
  }

  const uniqueMeds = [...new Set(cleanMeds)];
  
  // FAKE DATA HATA DIYA HAI. Ab sirf wahi check hoga jo OCR se mila hai.
  const finalMedsToCheck = uniqueMeds.slice(0, 6);

  // Agar OCR ne koi dawai nahi dhoondhi, toh yahin se error return kar do
  if (finalMedsToCheck.length === 0) {
    return {
      status: "error",
      medicines: ["Koi valid dawai nahi mili. Kripya sahi prescription upload karein."],
      drugInteractions: [],
      avoidList: [],
      dietList: [],
      sideEffectsList: []
    };
  }

  const medResults = [];
  const verifiedMeds = []; 
  
  let avoidList = [];
  let dietList = [];
  let sideEffectsList = [];

  for (const med of finalMedsToCheck) {
    const rxcui = await getRxCUI(med);
    
    if (rxcui) {
      medResults.push(`${med} ✅ (Verified)`);
      verifiedMeds.push(med);
    } else {
      medResults.push(`${med} ❌ (Not Found in DB)`);
    }

    // FOOD & DIET INTERACTION
    const medLower = med.toLowerCase();
    const matchedFoodKey = Object.keys(foodData).find(key => 
      medLower.includes(key) || key.includes(medLower)
    );

    if (matchedFoodKey) {
      const data = foodData[matchedFoodKey];
      if (data.avoid) avoidList = [...avoidList, ...data.avoid];
      if (data.diet) dietList = [...dietList, ...data.diet];
      if (data.sideEffects) sideEffectsList = [...sideEffectsList, ...data.sideEffects];
    }
  }

  // DRUG-DRUG INTERACTION CHECK
  let interactionsFound = [];
  let status = "safe";

  if (verifiedMeds.length >= 2) {
    for (let i = 0; i < verifiedMeds.length; i++) {
      for (let j = i + 1; j < verifiedMeds.length; j++) {
        const med1 = verifiedMeds[i];
        const med2 = verifiedMeds[j];
        
        const interaction = await checkDrugInteraction(med1, med2);
        
        if (interaction) {
          interactionsFound.push(`🚨 ${med1} + ${med2}: ${interaction}`);
          status = "high"; 
        }
      }
    }
  }

  if (interactionsFound.length === 0 && (avoidList.length > 0 || sideEffectsList.length > 0)) {
    status = "moderate";
  }

  if (interactionsFound.length === 0) {
    interactionsFound.push("No known severe interactions found between these medicines in FDA labels.");
  }

  if (avoidList.length === 0) avoidList.push("No specific food to avoid found.");
  if (dietList.length === 0) dietList.push("Take with water. Maintain a balanced diet.");
  if (sideEffectsList.length === 0) sideEffectsList.push("No specific side effects listed. Contact doctor if you feel unwell.");

  return {
    status: status,
    medicines: medResults.length > 0 ? medResults : ["No valid medicines found"],
    drugInteractions: interactionsFound,
    avoidList: [...new Set(avoidList)],       
    dietList: [...new Set(dietList)],         
    sideEffectsList: [...new Set(sideEffectsList)] 
  };
};