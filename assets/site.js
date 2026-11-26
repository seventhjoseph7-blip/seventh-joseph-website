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

// Savings calculator.
const calc = document.getElementById('calc');
if (calc) {
  const fmt = new Intl.NumberFormat(document.documentElement.lang === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  const update = () => {
    const salary = Math.max(0, Number(calc.salary.value) || 0);
    const staff = Math.max(0, Number(calc.staff.value) || 0);
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
