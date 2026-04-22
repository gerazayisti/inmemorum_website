const fs = require('fs');
const path = require('path');

const dir = 'src/app/admin';

function walkStrings(d) {
  const files = fs.readdirSync(d);
  for (const f of files) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) {
      walkStrings(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      
      const orig = content;
      content = content.replace(/sawa-blue/g, 'farewell-charcoal');
      content = content.replace(/sawa-gold/g, 'farewell-gold');
      content = content.replace(/sawa-cream/g, 'farewell-cream');
      content = content.replace(/sawa-foam/g, 'stone-100');
      content = content.replace(/sawa-wave/g, ''); 
      
      if (content !== orig) {
        fs.writeFileSync(full, content);
        console.log("Updated", full);
      }
    }
  }
}

walkStrings(dir);
