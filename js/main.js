/**
 * RYOSEIWORLD - Main Script
 */
document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile Menu Toggle ──
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      menu.classList.toggle('active');
    });
    // メニューリンククリックで閉じる
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Header scroll effect ──
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
      } else {
        header.style.background = 'rgba(10, 10, 10, 0.85)';
      }
    });
  }

  // ── Scroll animation (Intersection Observer) ──
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .strength-item, .pricing-card, .contact-method').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // animate-in class
  var style = document.createElement('style');
  style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // ── Contact Form (AJAX) ──
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = '送信中...';
      btn.disabled = true;

      var formData = new FormData(form);
      formData.append('action', 'contact_form');
      formData.append('nonce', typeof ryosei_ajax !== 'undefined' ? ryosei_ajax.nonce : '');

      var url = typeof ryosei_ajax !== 'undefined' ? ryosei_ajax.ajax_url : '';

      if (url) {
        fetch(url, { method: 'POST', body: formData })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            if (data.success) {
              form.innerHTML = '<div style="text-align:center;padding:40px;"><p style="font-size:1.2rem;margin-bottom:8px;">送信完了</p><p style="color:var(--text-secondary);">お問い合わせありがとうございます。<br>内容を確認の上、ご連絡いたします。</p></div>';
            } else {
              alert(data.data || 'エラーが発生しました。');
              btn.textContent = originalText;
              btn.disabled = false;
            }
          })
          .catch(function () {
            alert('通信エラーが発生しました。');
            btn.textContent = originalText;
            btn.disabled = false;
          });
      } else {
        // WordPress外のプレビュー時
        form.innerHTML = '<div style="text-align:center;padding:40px;"><p style="font-size:1.2rem;margin-bottom:8px;">送信完了（プレビュー）</p><p style="color:var(--text-secondary);">WordPress環境で動作します。</p></div>';
      }
    });
  }
});
