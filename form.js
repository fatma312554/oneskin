function getFormData(form) {
  const data = new FormData(form);
  const obj = Object.fromEntries(data.entries());
  obj.symptomes = data.getAll('symptomes'); // array
  return obj;
}

function recommendRoutine(d) {
  const routine = [];
  const tips = [];

  const isSensitive = d.type === 'Sensible' || d.reactif === 'Oui' ||
    d.symptomes.includes('rougeurs') || d.symptomes.includes('tiraillements') || d.symptomes.includes('demangeaisons');

  // Nettoyant
  if (isSensitive) {
    routine.push({ step: 'Nettoyant', name: 'Gel Nettoyant Doux – sans parfum, pH 5.5' });
    tips.push('Évite les nettoyants avec SLS/SLES, préfère des tensioactifs doux.');
  } else if (d.pollution === 'Forte') {
    routine.push({ step: 'Nettoyant', name: 'Crème Nettoyante Antioxydante – douce' });
    tips.push('Un seul nettoyage le soir suffit; pas d’exfoliation quotidienne.');
  } else {
    routine.push({ step: 'Nettoyant', name: 'Gel Nettoyant Équilibrant – doux' });
  }

  // Toner
  if (isSensitive) {
    routine.push({ step: 'Toner', name: 'Toner Apaisant – niacinamide 2–4%, panthénol' });
    tips.push('Teste sur une petite zone avant application complète.');
  } else {
    routine.push({ step: 'Toner', name: 'Toner Hydratant – humectants (glycérine)' });
  }

  // Sérum
  const premenstruelAcne = d.cycle === 'Prémenstruel' && d.symptomes.includes('boutons');
  if (isSensitive) {
    if (premenstruelAcne) {
      routine.push({ step: 'Sérum', name: 'BHA doux 0.5–1% (2–3x/semaine), cica' });
      tips.push('Évite AHAs forts et rétinol si sensation de brûlure.');
    } else {
      routine.push({ step: 'Sérum', name: 'Sérum Calm – céramides + cica' });
    }
  } else {
    routine.push({ step: 'Sérum', name: 'Sérum Éclat – antioxydants doux' });
  }

  // Crème
  if (isSensitive || d.type === 'Sèche' || d.symptomes.includes('tiraillements')) {
    routine.push({ step: 'Crème', name: 'Crème Barrière – céramides, squalane, sans parfum' });
    tips.push('Applique sur peau légèrement humide pour mieux retenir l’eau.');
  } else {
    routine.push({ step: 'Crème', name: 'Crème Légère – non comédogène' });
  }

  // SPF
  if (d.soleil === 'Forte' || isSensitive) {
    routine.push({ step: 'SPF', name: 'Écran Minéral SPF 50+ – ZnO/TiO2, sans parfum' });
    tips.push('Renouvelle toutes les 2–3 heures si exposition continue.');
  } else {
    routine.push({ step: 'SPF', name: 'SPF 30–50 – texture fluide' });
  }

  // Ajustements selon sommeil/stress
  const sommeil = parseFloat(d.sommeil || '7');
  if (sommeil < 6 || d.stress === 'Élevé') {
    tips.push('Priorise hydratation (céramides, panthénol) et routine minimaliste.');
  }

  return { routine, tips };
}

document.getElementById('skinForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = getFormData(e.target);
  const { routine, tips } = recommendRoutine(data);

  const routineDiv = document.getElementById('routine');
  routineDiv.innerHTML = routine.map(r =>
    `<p class="routine-item"><strong>${r.step}:</strong> ${r.name}</p>`
  ).join('');

  const tipsUl = document.getElementById('tips');
  tipsUl.innerHTML = tips.map(t => `<li class="tip-muted">${t}</li>`).join('');

  document.getElementById('result').hidden = false;
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
});
