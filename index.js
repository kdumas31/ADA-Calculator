function generateRecommendation() {
    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const bmi = parseFloat(document.getElementById('bmi').value);
    const a1c = parseFloat(document.getElementById('a1c').value);
    const fpg = parseInt(document.getElementById('fpg').value);
    const ogtt = document.getElementById('ogtt').value ? parseInt(document.getElementById('ogtt').value) : null;
    const eGFR = document.getElementById('eGFR').value ? parseInt(document.getElementById('eGFR').value) : null;
    const uacr = document.getElementById('uacr').value ? parseInt(document.getElementById('uacr').value) : null;
    
    // Get checkboxes
    const hasHypertension = document.getElementById('hypertension').checked;
    const hasDyslipidemia = document.getElementById('dyslipidemia').checked;
    const hasCVD = document.getElementById('cvd').checked;
    const hasCKD = document.getElementById('ckd').checked;
    const hasHF = document.getElementById('hf').checked;
    const hasFamily = document.getElementById('family').checked;
    
    // Get current medications
    const onMetformin = document.getElementById('metformin').checked;
    const onSGLT2 = document.getElementById('sglt2').checked;
    const onGLP1 = document.getElementById('glp1').checked;
    const onDPP4 = document.getElementById('dpp4').checked;
    const onInsulin = document.getElementById('insulin').checked;
    const onSulfonylurea = document.getElementById('sulfonylurea').checked;
    
    // Validate required inputs
    if (!age || !bmi || !a1c || !fpg) {
        alert("Please fill in all required fields (Age, BMI, HbA1c, and Fasting Plasma Glucose)");
        return;
    }
    
    // Determine diagnosis
    let diagnosisText = "";
    let diagnosisClass = "";
    
    if (a1c >= 6.5 || fpg >= 126 || (ogtt && ogtt >= 200)) {
        diagnosisText = "Diabetes Mellitus";
        diagnosisClass = "diabetes";
    } else if ((a1c >= 5.7 && a1c < 6.5) || (fpg >= 100 && fpg < 126) || (ogtt && ogtt >= 140 && ogtt < 200)) {
        diagnosisText = "Prediabetes / High Risk for Diabetes";
        diagnosisClass = "prediabetes";
    } else {
        diagnosisText = "Normal glycemic status";
        diagnosisClass = "normal";
    }
    
    // Set diagnosis text with appropriate class
    document.getElementById('diagnosis').innerHTML = `<span class="${diagnosisClass}">${diagnosisText}</span>`;
    
    // Determine glycemic targets
    let glycemicTargets = "";
    
    if (diagnosisText.includes("Diabetes")) {
        if (age < 65 && !hasCVD && !hasCKD) {
            glycemicTargets = "Target HbA1c: <7.0% (individualized based on patient factors)";
        } else if (age >= 65 || hasCVD || hasCKD || hasHF) {
            glycemicTargets = "Target HbA1c: <8.0% (less stringent due to age or comorbidities)";
        }
    } else if (diagnosisText.includes("Prediabetes")) {
        glycemicTargets = "Goal: Prevent progression to diabetes. Target HbA1c: <5.7%";
    } else {
        glycemicTargets = "Maintain normal glycemic status. Routine screening recommended based on risk factors.";
    }
    
    document.getElementById('glycemicTargets').textContent = glycemicTargets;
    
    // Lifestyle recommendations
    let lifestyleHTML = "<ul>";
    
    if (diagnosisText.includes("Diabetes") || diagnosisText.includes("Prediabetes")) {
        lifestyleHTML += "<li>Medical nutrition therapy - consider referral to registered dietitian</li>";
        
        if (bmi >= 25) {
            lifestyleHTML += "<li>Weight loss of 5-10% of body weight recommended</li>";
        }
        
        lifestyleHTML += "<li>Physical activity: 150 minutes/week of moderate-intensity exercise</li>";
        lifestyleHTML += "<li>Smoking cessation (if applicable)</li>";
        
        if (hasHypertension) {
            lifestyleHTML += "<li>Reduce sodium intake to <2,300 mg/day</li>";
        }
        
        if (hasDyslipidemia) {
            lifestyleHTML += "<li>Limit saturated fat to <10% of calories and avoid trans fats</li>";
        }
    } else {
        lifestyleHTML += "<li>Maintain healthy diet rich in fruits, vegetables, and whole grains</li>";
        lifestyleHTML += "<li>Regular physical activity (150 minutes/week)</li>";
        
        if (hasFamily || bmi >= 25) {
            lifestyleHTML += "<li>Annual screening for diabetes recommended due to risk factors</li>";
        }
    }
    
    lifestyleHTML += "</ul>";
    document.getElementById('lifestyle').innerHTML = lifestyleHTML;
    
    // Pharmacologic recommendations
    let medicationsHTML = "<ul>";
    
    if (diagnosisText.includes("Diabetes")) {
        // First-line therapy - Updated to prioritize GLP-1 RA for obesity
        if (bmi >= 30 && !onGLP1) {
            medicationsHTML += "<li><strong>First-line for obesity (BMI ≥30):</strong> GLP-1 receptor agonist";
            medicationsHTML += "<br><span class='warning'>Contraindications: personal/family history of medullary thyroid carcinoma or Multiple Endocrine Neoplasia syndrome type 2, history of pancreatitis, severe gastrointestinal disease</span></li>";
        } else if (!onMetformin) {
            medicationsHTML += "<li><strong>First-line:</strong> Initiate metformin";
            medicationsHTML += "<br><span class='warning'>Contraindications: eGFR <30 mL/min/1.73m², acute or unstable heart failure, history of lactic acidosis, severe liver disease</span></li>";
        }
        
        // ASCVD, CKD, or HF considerations
        if ((hasCVD || hasCKD || hasHF) && !onSGLT2 && !onGLP1) {
            if (hasCVD) {
                medicationsHTML += "<li><strong>For ASCVD:</strong> Add GLP-1 RA or SGLT2 inhibitor with demonstrated cardiovascular benefit";
                medicationsHTML += "<br><span class='warning'>SGLT2 Contraindications: eGFR <30 mL/min/1.73m² (varies by agent), history of diabetic ketoacidosis, type 1 diabetes</span></li>";
            }
            
            if (hasCKD) {
                if (eGFR && eGFR >= 30) {
                    medicationsHTML += "<li><strong>For CKD:</strong> Add SGLT2 inhibitor with demonstrated kidney benefit";
                    medicationsHTML += "<br><span class='warning'>Contraindications: severe renal impairment (eGFR <30 mL/min/1.73m² for most agents), dialysis, kidney transplantation</span></li>";
                } else {
                    medicationsHTML += "<li><strong>For CKD with eGFR <30:</strong> Consider GLP-1 RA with demonstrated kidney benefit";
                    medicationsHTML += "<br><span class='warning'>Use with caution in severe renal impairment; dose adjustments may be needed</span></li>";
                }
            }
            
            if (hasHF) {
                medicationsHTML += "<li><strong>For heart failure:</strong> Add SGLT2 inhibitor with demonstrated heart failure benefit";
                medicationsHTML += "<br><span class='warning'>Use with caution in patients on loop diuretics; may need diuretic dose adjustment</span></li>";
            }
        }
        
        // Additional therapy based on A1c
        if (a1c >= 9.0 && !onInsulin) {
            medicationsHTML += "<li><strong>For HbA1c ≥9.0%:</strong> Consider combination injectable therapy (basal insulin + GLP-1 RA) or multiple daily insulin injections";
            medicationsHTML += "<br><span class='warning'>Insulin contraindications: none absolute, but use with caution in hypoglycemia unawareness or recurrent severe hypoglycemia</span></li>";
        } else if (a1c >= 8.0 && !onGLP1 && !onSGLT2 && !onDPP4 && !onSulfonylurea) {
            if (bmi >= 27) {
                medicationsHTML += "<li><strong>For HbA1c ≥8.0% with BMI ≥27:</strong> Add GLP-1 RA if not already initiated</li>";
            } else {
                medicationsHTML += "<li><strong>For HbA1c ≥8.0%:</strong> Consider dual therapy (metformin + another agent)</li>";
            }
        }
        
        // Cost considerations
        if (a1c >= 7.0 && !(onSGLT2 || onGLP1) && !hasCVD && !hasCKD && !hasHF) {
            medicationsHTML += "<li>If cost is a major issue: Consider sulfonylurea or DPP-4 inhibitor as add-on to metformin";
            medicationsHTML += "<br><span class='warning'>Sulfonylurea contraindications: severe hepatic or renal impairment, history of severe hypoglycemia</span>";
            medicationsHTML += "<br><span class='warning'>DPP-4 inhibitor contraindications: history of pancreatitis (for some agents), dose adjustment needed in renal impairment</span></li>";
        }
        
        // Hypoglycemia risk warning if on insulin or sulfonylurea
        if (onInsulin || onSulfonylurea) {
            medicationsHTML += "<li class='warning'>Note: Current medication regimen includes agents with hypoglycemia risk. Consider education on hypoglycemia recognition and management.</li>";
        }
    } else if (diagnosisText.includes("Prediabetes")) {
        if (bmi >= 35 || (bmi >= 30 && age < 60)) {
            medicationsHTML += "<li>Consider metformin for prevention of Type 2 diabetes, especially for BMI ≥35 kg/m², those <60 years of age, or women with prior gestational diabetes";
            medicationsHTML += "<br><span class='warning'>Contraindications: eGFR <30 mL/min/1.73m², acute or unstable heart failure, severe liver disease</span></li>";
            
            // Add GLP-1 RA as option for prevention in obesity
            if (bmi >= 35) {
                medicationsHTML += "<li>GLP-1 receptor agonists may be considered for prevention of diabetes in individuals with BMI ≥35 kg/m² and additional risk factors";
                medicationsHTML += "<br><span class='warning'>Contraindications: personal/family history of medullary thyroid carcinoma, Multiple Endocrine Neoplasia syndrome type 2, history of pancreatitis</span></li>";
            }
        } else {
            medicationsHTML += "<li>Lifestyle modification is primary intervention for prediabetes</li>";
        }
    } else {
        medicationsHTML += "<li>No diabetes medications indicated</li>";
    }
    
    medicationsHTML += "</ul>";
    document.getElementById('medications').innerHTML = medicationsHTML;
    
    // Monitoring recommendations
    let monitoringHTML = "<ul>";
    
    if (diagnosisText.includes("Diabetes")) {
        monitoringHTML += "<li>HbA1c testing 2-4 times per year depending on stability</li>";
        
        if (onInsulin) {
            monitoringHTML += "<li>Blood glucose self-monitoring multiple times daily</li>";
        } else {
            monitoringHTML += "<li>Consider blood glucose self-monitoring to guide therapy adjustments</li>";
        }
        
        monitoringHTML += "<li>Annual comprehensive eye exam</li>";
        monitoringHTML += "<li>Annual comprehensive foot exam</li>";
        monitoringHTML += "<li>Annual screening for albuminuria</li>";
        monitoringHTML += "<li>Lipid profile and cardiovascular risk assessment</li>";
        
        if (hasHypertension) {
            monitoringHTML += "<li>Blood pressure monitoring at each clinical visit</li>";
        }
        
        if (hasCKD) {
            monitoringHTML += "<li>More frequent monitoring of kidney function (eGFR, UACR)</li>";
        }
        
        // Add specific monitoring for medications
        if (onSGLT2) {
            monitoringHTML += "<li>For SGLT2 inhibitors: Monitor for genital mycotic infections, urinary tract infections, hypotension, and diabetic ketoacidosis</li>";
        }
        
        if (onGLP1) {
            monitoringHTML += "<li>For GLP-1 receptor agonists: Monitor for nausea/vomiting, pancreatitis symptoms, injection site reactions</li>";
        }
    } else if (diagnosisText.includes("Prediabetes")) {
        monitoringHTML += "<li>Annual HbA1c or fasting glucose testing</li>";
        monitoringHTML += "<li>Annual assessment of cardiovascular risk factors</li>";
    } else {
        if (hasFamily || bmi >= 25) {
            monitoringHTML += "<li>Diabetes screening every 3 years due to risk factors</li>";
        } else {
            monitoringHTML += "<li>Diabetes screening starting at age 35, repeated every 3 years</li>";
        }
    }
    
    monitoringHTML += "</ul>";
    document.getElementById('monitoring').innerHTML = monitoringHTML;
    
    // Display results
    document.getElementById('results').style.display = 'block';
}
