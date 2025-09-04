    let varCounter = 0;
    function addVariable() {
      const container = document.getElementById('variableInputs');
      const newRow = document.createElement('div');
      newRow.className = 'variable-row';
      varCounter++;
      const nameId = 'var-name-' + varCounter;
      const valueId = 'var-value-' + varCounter;
      newRow.innerHTML = `
        <input type="text" id="${nameId}" placeholder="Variable name" class="var-name"/>
        <input type="number" id="${valueId}" placeholder="Value" class="var-value" step="any"/>
        <button type="button" class="btn-danger" onclick="removeVariable(this)">Remove</button>
      `;
      container.appendChild(newRow);
      setTimeout(()=> document.getElementById(nameId).focus(),100);
    }
    function removeVariable(btn) {
      const c = document.getElementById('variableInputs');
      if (c.children.length > 1) btn.parentNode.remove();
      else showError('At least one variable is required.');
    }
    function calculate() {
      hideError(); hideResult(); hideWarning();
      const formula = document.getElementById('formula').value.trim();
      if (!formula) { showError('Enter a formula.'); return; }
      const names = document.querySelectorAll('.var-name');
      const vals  = document.querySelectorAll('.var-value');
      const vars = {}, list = [];
      for (let i=0;i<names.length;i++){
        const n=names[i].value.trim(), v=vals[i].value.trim();
        if(n&&v!==''){ const num=parseFloat(v);
          if(!isNaN(num)){ vars[n]=num; list.push(`${n}=${num}`); } }
      }
      if(Object.keys(vars).length===0){ showError('Define variables and values.'); return; }
      // warn on implicit multiplication
      const bad= (formula.match(/\b\d*[A-Za-z]+\d*\b/g)||[])
                    .filter(t=>!/^(sin|cos|tan|log|sqrt)$/.test(t));
      if(bad.length) showWarning(`Implicit multiply in ${bad.join(',')}; use '*' explicitly.`);
      let expr = formula;
      Object.keys(vars).sort((a,b)=>b.length-a.length).forEach(n=>{
        expr=expr.split(n).join(`(${vars[n]})`);
      });
      if(/[A-Za-z]/.test(expr)) { showError('Undefined variables remain.'); return; }
      if(!/^[0-9+\-*/().\s]+$/.test(expr)){ showError('Invalid chars.'); return; }
      try {
        const res=eval(expr);
        if(isNaN(res)||!isFinite(res)) throw '';
        document.getElementById('resultValue').textContent = res;
        document.getElementById('calculation-steps').innerHTML =
          `<strong>Original:</strong> ${formula}<br>
           <strong>Evaluated:</strong> ${expr}<br>
           <strong>Variables:</strong> ${list.join(', ')}`;
        document.getElementById('result').style.display = 'block';
      } catch(e) {
        showError('Calc error: ensure syntax is correct.');
      }
    }
    function clearAll(){
      document.getElementById('formula').value='';
      document.querySelectorAll('.var-name,.var-value').forEach(i=>i.value='');
      hideError(); hideResult(); hideWarning();
    }
    function showError(msg){
      const e=document.getElementById('error');
      e.textContent=msg; e.style.display='block';
    }
    function hideError(){ document.getElementById('error').style.display='none'; }
    function showWarning(msg){
      const w=document.getElementById('warning');
      w.textContent=msg; w.style.display='block';
    }
    function hideWarning(){ document.getElementById('warning').style.display='none'; }
    function hideResult(){ document.getElementById('result').style.display='none'; }
    document.addEventListener('keydown',e=>{ if(e.ctrlKey&&e.key==='Enter') calculate(); });
