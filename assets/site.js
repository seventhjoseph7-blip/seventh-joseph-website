// Shared behaviour for every language version. Page text lives in the HTML;
// strings the script builds come from data-* attributes on the elements.
const WA_NUMBER = '6282120849850';
const EMAIL = 'seventhjoseph@gmail.com';

// Mobile menu: close the popover after choosing a link.
const nav = document.getElementById('navlinks');
nav.addEventListener('click', e => {
  if (e.target.closest('a') && nav.matches(':popover-open')) nav.hidePopover();
});

document.getElementById('year').textContent = new Date().getFullYear();

// Light/dark toggle. The <head> script already picked the starting theme
// (saved choice, else the system setting); this flips it and remembers the choice.
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  const sync = () => themeBtn.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  sync();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage blocked: still switches for this visit */ }
    sync();
  });
}

// Savings calculator.
const calc = document.getElementById('calc');
if (calc) {
  const locale = document.documentElement.lang === 'id' ? 'id-ID' : 'en-US';
  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  const group = new Intl.NumberFormat(locale);
  const digits = s => s.replace(/\D/g, '');

  // Salary field: keep thousand separators (5.000.000) while typing,
  // and keep the caret after the same digit it was after.
  const salaryInput = calc.salary;
  salaryInput.addEventListener('input', () => {
    const caret = salaryInput.selectionStart ?? salaryInput.value.length;
    const digitsBefore = digits(salaryInput.value.slice(0, caret)).length;
    const raw = digits(salaryInput.value).replace(/^0+(?=\d)/, '').slice(0, 12);
    salaryInput.value = raw ? group.format(Number(raw)) : '';
    let pos = 0, seen = 0;
    while (pos < salaryInput.value.length && seen < digitsBefore) { if (/\d/.test(salaryInput.value[pos])) seen++; pos++; }
    salaryInput.setSelectionRange(pos, pos);
  });

  const update = () => {
    const salary = Number(digits(salaryInput.value)) || 0;
    const staff = Math.min(500, Math.max(0, Math.floor(Number(calc.staff.value) || 0)));
    const share = Number(calc.share.value) / 100;
    const monthly = salary * staff * share;          // value of the work taken over each month
    calc.querySelector('[name=fee]').value = fmt.format(monthly * 2);
    calc.querySelector('[name=monthly]').value = fmt.format(monthly);
    calc.querySelector('[name=year]').value = fmt.format(monthly * 10);
    calc.querySelector('[name=controller]').value = fmt.format(monthly * 0.1);
  };
  calc.addEventListener('input', update);
  update();
}

// Contact form: open WhatsApp or the visitor's email app with the message filled in.
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = form.dataset;
  const via = (e.submitter && e.submitter.value) || 'wa';
  const text = d.greeting + '\n\n'
    + d.lName + ': ' + form.name.value.trim() + '\n'
    + d.lEmail + ': ' + form.email.value.trim() + '\n'
    + d.lType + ': ' + form.type.value + '\n\n'
    + form.message.value.trim();
  if (via === 'email') {
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(d.subject + ' – ' + form.name.value.trim()) + '&body=' + encodeURIComponent(text);
  } else {
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }
});
