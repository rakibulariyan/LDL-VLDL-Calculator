document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    
    calculateBtn.addEventListener('click', calculateCholesterol);
    
    function calculateCholesterol() {
        // Get input values
        const totalChol = parseFloat(document.getElementById('total-cholesterol').value);
        const hdl = parseFloat(document.getElementById('hdl-cholesterol').value);
        const trig = parseFloat(document.getElementById('triglycerides').value);
        
        // Validate inputs
        if (isNaN(totalChol) || isNaN(hdl) || isNaN(trig)) {
            alert('Please enter valid numbers for all fields');
            return;
        }
        
        if (totalChol <= 0 || hdl <= 0 || trig <= 0) {
            alert('Values must be greater than zero');
            return;
        }
        
        if (trig > 400) {
            alert('Note: For triglyceride levels above 400 mg/dL, the Friedewald formula may not be accurate. Please consult your doctor for more precise testing.');
        }
        
        // Calculate LDL and VLDL
        const vldl = trig / 5;
        const ldl = totalChol - hdl - vldl;
        
        // Display results
        resultsDiv.innerHTML = `
            <h3>Your Cholesterol Results</h3>
            
            <div class="result-item">
                <span class="result-label">Total Cholesterol:</span>
                <span class="result-value">${totalChol} mg/dL</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">HDL ("Good" Cholesterol):</span>
                <span class="result-value">${hdl} mg/dL</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">LDL ("Bad" Cholesterol):</span>
                <span class="result-value ${getLdlClass(ldl)}">${ldl.toFixed(1)} mg/dL</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">VLDL Cholesterol:</span>
                <span class="result-value">${vldl.toFixed(1)} mg/dL</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">Triglycerides:</span>
                <span class="result-value ${getTrigClass(trig)}">${trig} mg/dL</span>
            </div>
            
            <div class="interpretation">
                <h3>Interpretation</h3>
                ${getInterpretation(ldl, hdl, trig, totalChol)}
            </div>
        `;
        
        // Show results
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    function getLdlClass(ldl) {
        if (ldl < 100) return 'normal';
        if (ldl <= 129) return 'normal';
        if (ldl <= 159) return 'borderline';
        return 'high';
    }
    
    function getTrigClass(trig) {
        if (trig < 150) return 'normal';
        if (trig <= 199) return 'borderline';
        return 'high';
    }
    
    function getInterpretation(ldl, hdl, trig, totalChol) {
        let interpretation = '';
        
        // LDL interpretation
        interpretation += `<div class="result-item">
            <span class="result-label">LDL Cholesterol:</span>
            <span class="result-value ${getLdlClass(ldl)}">${getLdlText(ldl)}</span>
        </div>`;
        
        // HDL interpretation
        interpretation += `<div class="result-item">
            <span class="result-label">HDL Cholesterol:</span>
            <span class="result-value ${hdl < 40 ? 'high' : hdl < 60 ? 'borderline' : 'normal'}">
                ${hdl < 40 ? 'Low (Risk Factor)' : hdl < 60 ? 'Acceptable' : 'Optimal (Protective)'}
            </span>
        </div>`;
        
        // Triglycerides interpretation
        interpretation += `<div class="result-item">
            <span class="result-label">Triglycerides:</span>
            <span class="result-value ${getTrigClass(trig)}">
                ${trig < 150 ? 'Normal' : trig <= 199 ? 'Borderline High' : 'High'}
            </span>
        </div>`;
        
        // Total Cholesterol interpretation
        interpretation += `<div class="result-item">
            <span class="result-label">Total Cholesterol:</span>
            <span class="result-value ${totalChol < 200 ? 'normal' : totalChol <= 239 ? 'borderline' : 'high'}">
                ${totalChol < 200 ? 'Desirable' : totalChol <= 239 ? 'Borderline High' : 'High'}
            </span>
        </div>`;
        
        // Add general advice
        interpretation += `<div class="note">
            <strong>Recommendation:</strong> 
            ${ldl > 130 || trig > 200 || hdl < 40 || totalChol > 240 ? 
              'Your results indicate elevated cholesterol levels. Consider consulting with a healthcare provider.' : 
              'Your cholesterol levels are generally healthy. Maintain a balanced diet and regular exercise.'}
        </div>`;
        
        return interpretation;
    }
    
    function getLdlText(ldl) {
        if (ldl < 100) return 'Optimal';
        if (ldl <= 129) return 'Near Optimal';
        if (ldl <= 159) return 'Borderline High';
        if (ldl <= 189) return 'High';
        return 'Very High';
    }
});