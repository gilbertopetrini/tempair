/* =========================================================
   Temp Air — Scripts da landing page
   ========================================================= */
(function () {
  'use strict';

  /* ---- Menu mobile (toggle acessível) ---- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');

  function closeMenu() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
  }
  function openMenu() {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu de navegação');
  }

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('open')) { closeMenu(); } else { openMenu(); }
  });

  /* Fecha o menu com a tecla ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); }
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Rolagem suave com compensação do header fixo ---- */
  var header = document.querySelector('.site-header');

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') { return; }
      var target = document.querySelector(href);
      if (!target) { return; }

      e.preventDefault();
      closeMenu(); /* fecha o menu mobile, se aberto */

      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });

      /* Move o foco para a seção (navegação por teclado) sem novo salto */
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      history.pushState(null, '', href);
    });
  });

  /* ---- Carrossel de projetos (botões anterior/próximo) ---- */
  var track = document.getElementById('installs-track');
  if (track) {
    /* Lista de projetos realizados — edite/adicione itens aqui (b: selo, t: título, d: descrição) */
    var projetos = [
      { img: "midias/Arsenal de Marinha - Concrejato.jpg", b: "VRF + Split + ar de precisão", t: "Marinha do Brasil — Arsenal de Marinha (EMGEPRON)", d: "Prédio 8. Ar condicionado de expansão direta com VRF e Split System, incluindo unidades de ar de precisão no Datacenter." },
      { vid: "midias/fairmountvideo.mp4", img: "midias/Hotel Fairmount.jpg", b: "Troca de chiller", t: "Hotel Fairmont Copacabana", d: "Substituição do chiller — o equipamento central que resfria a água gelada do sistema de climatização. Removemos a unidade antiga e instalamos um novo chiller mais eficiente, integrado à infraestrutura hidráulica e elétrica existente, elevando o desempenho, a confiabilidade e a eficiência energética da climatização do hotel." },
      { img: "midias/hospital.jpg", b: "Hospitalar · 26.300 m²", t: "Hospital Universitário UFU — Uberlândia", d: "Obra para IBEG Engenharia e Construção. Prédio hospitalar de 26.300 m². Projeto de ar condicionado e demais sistemas de VAC." },
      { img: "midias/senac.jpg", b: "Água gelada · 450 TR", t: "Retrofit SENAC/RJ — Av. Presidente Vargas", d: "Prédio de 15 pavimentos. Projeto, fornecimento e montagem de ar condicionado, exaustão mecânica, pressurização de escada e ventilação de ar exterior (água gelada, 450 TR). Exaustão das coifas das cozinhas (30 coifas, 80.000 m³/h) e condicionadores de ar exterior especiais (100 TR)." },
      { b: "VRF Inverter · 300 TR", t: "Ampliação Colégio Marista — Barra da Tijuca", d: "Projeto, fornecimento e montagem de ar condicionado, exaustão mecânica e ar exterior para salas de aula, auditórios e teatro. Sistema VRF (inverter), 300 TR." },
      { b: "VRF · 360 TR", t: "Retrofit FAPERJ — Rua da Alfândega", d: "Prédio de 9 pavimentos, obra para a construtora Concrejato Engenharia. Sistema VRF de condicionadores de ar exterior especiais (360 TR), com exaustão mecânica e ar exterior." },
      { b: "Água gelada · 200 TR", t: "Retrofit Opportunity — Rua Dom Gerardo", d: "Prédios comerciais (4 e 9 pavimentos), obra para a Construtora Rios Engenharia. Sistema de água gelada (200 TR), ventilação mecânica e pressurização de escadas." },
      { b: "Self-Contained · 20 TR", t: "Hospital Praia Brava — UTI", d: "Projeto, fornecimento e montagem do ar condicionado (20 TR) com equipamentos Self-Contained microprocessados, filtragem absoluta e controle de umidade." },
      { b: "Água gelada · 120 TR", t: "Retrofit Shopping Tijuca — Alameda Gourmet", d: "Projeto de ar condicionado em água gelada (120 TR) para a Alameda Gourmet e a área de expansão do subsolo." },
      { b: "Exaustão · 8.000 m³/h", t: "NUCLEP — Cabines de Pintura e Solda", d: "Projeto, fornecimento e montagem do sistema de exaustão mecânica das seções de solda e pintura (diversas capelas). Capacidade: 8.000 m³/h." },
      { b: "285 splits · 130 exaustores", t: "Residencial Charitas — Dorex", d: "Projeto, fornecimento e montagem de ar condicionado e exaustão mecânica. 285 mini splits e 130 mini exaustores." },
      { b: "Classe 10.000 · 120 TR", t: "Optotal Hoya — Laboratório de Lentes", d: "Ar condicionado classe 10.000 e ventilação do ar exterior para a produção de lentes, com automação, controle de umidade/temperatura e filtragem absoluta. Água gelada, 120 TR." },
      { b: "Condensação a água · 130 TR", t: "Teatro Colégio Pedro II — Realengo", d: "Obra para IBEG. Ar condicionado central e exaustão para auditório, plateia, camarins, palco e áreas administrativas, com tratamento acústico especial e equipamentos inverter. 130 TR." },
      { b: "990 splits · 330 exaustores", t: "Residenciais MDL Realty — Jacarepaguá", d: "4 blocos de 7 pavimentos cada. 990 mini splits e 330 mini exaustores." },
      { b: "Ventilação · 18.000 m³/h", t: "Ediouro Publicações — Gráfica", d: "Projeto, fornecimento e montagem dos sistemas de ventilação mecânica e exaustão da nova gráfica. Capacidade: 18.000 m³/h." },
      { b: "Condensação a água · 100 TR", t: "Academia Nacional de Medicina", d: "Ar condicionado (100 TR, condensação a água) para o Salão Nobre, áreas administrativas e auditório." },
      { b: "VRF · 300 TR", t: "Retrofit Dovel / Opportunity", d: "Construtora Campanha de Moraes. Retrofit de prédio de 9 pavimentos. VRF com condensação a água, 300 TR." },
      { b: "Água gelada · 320 TR", t: "Retrofit MDL Realty — Botafogo", d: "Retrofit de prédio de 12 pavimentos em Botafogo. Sistema de água gelada, 320 TR." },
      { b: "245 splits · 98 exaustores", t: "Residencial Leonel Magalhães — Dorex", d: "Blocos 1 e 2. Projeto, fornecimento e montagem de ar condicionado e exaustão mecânica. 245 mini splits e 98 mini exaustores." },
      { b: "Água gelada · 90 TR", t: "Consulado do Canadá — 5º e 13º pav.", d: "Casais Brasil Engenharia. Ar condicionado, exaustão mecânica e ar exterior tratado, com automação microprocessada. Água gelada, 90 TR." },
      { b: "Água gelada · 10 TR", t: "Optotal Hoya — Sala de Compressores", d: "Sistema de água gelada, 10 TR." },
      { b: "Expansão direta · 90 TR", t: "Retrofit Polícia Federal — Praça Mauá", d: "Construtora Prosper. 2 pavimentos de escritórios e gabinetes. Expansão direta com condensação a ar, 90 TR." },
      { b: "Água gelada 150 TR + Split 30 TR", t: "Retrofit Teatro Nelson Rodrigues", d: "Sistema de água gelada (150 TR) e sistema mini split (30 TR)." },
      { b: "Split", t: "Zepix — Prédio Comercial", d: "Ar condicionado split para prédio comercial." },
      { b: "Loja comercial", t: "Plaza Shopping Niterói — Loja Opção", d: "Sistema de ar condicionado para loja comercial." },
      { b: "Exaustão mecânica", t: "ION Intelligent Center", d: "Projeto de exaustão mecânica das lojas e da praça de alimentação." },
      { b: "Loja comercial", t: "Plaza Shopping Niterói — Depyl Action", d: "Sistema de ar condicionado para loja comercial." },
      { b: "Split/Splitão · 44 TR", t: "BT Barra Crossfit", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 44 TR." },
      { b: "Split/Splitão · 97,5 TR", t: "BT Barra Vogue", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 97,5 TR." },
      { b: "Split/Splitão · 106 TR", t: "BT Teresina", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 106 TR." },
      { b: "Split/Splitão · 56,4 TR", t: "Fórmula Flamengo", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 56,4 TR." },
      { b: "Split/Splitão · 133 TR", t: "BT Hebraica", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 133 TR." },
      { b: "Split/Splitão · 84 TR", t: "Fórmula Wallig — POA", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 84 TR." },
      { b: "Split/Splitão · 71,5 TR", t: "Fórmula Nova Iguaçu", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 71,5 TR." },
      { b: "Split/Splitão · 102 TR", t: "BT Shopping da Gávea", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 102 TR." },
      { b: "Split/Splitão · 85 TR", t: "BT Asa Norte — DF", d: "Academia (rede Fórmula Fitness / Bodytec). Condicionadores de ar tipo Split e Splitão. Capacidade 85 TR." },
      { b: "VRF · 97 TR", t: "Senai Soldas — Maracanã", d: "Projeto e fornecimento de ar condicionado e ventilação mecânica. Sistema VRF, 97 TR." },
      { b: "VRV Daikin · 58 HP", t: "Clínica Primes Sculp & Spa", d: "Instalação de sistema VRV Daikin (58 HP) e sistema especial Traydus de ar exterior, no Shopping Village Mall." },
      { b: "Split System · 75+ unid.", t: "Hospital Placi — Botafogo", d: "Ar condicionado, ventilação e exaustão mecânica. Split System com mais de 75 unidades e pressurização de escadas." },
      { b: "Hospitalar", t: "Hospital Maternidade São Francisco", d: "Ar condicionado na UTI adulto, ampliação da UTI neonatal, sala de tomografia e ampliação do centro cirúrgico." },
      { b: "Expansão direta", t: "Hospital Placi — Niterói", d: "Ar condicionado na ampliação dos quartos, com unidades de expansão direta e condensação a ar." },
      { b: "VRV Daikin · 120 HP", t: "Academia Bodytech — Leblon", d: "Projeto de ar condicionado e ventilação mecânica da unidade do Shopping Leblon. Sistema VRV Daikin, 120 HP." },
      { b: "VRF Hitachi · 64 HP", t: "Paramount Pictures Brasil", d: "Projeto de ar condicionado e ventilação mecânica com sistema VRF Hitachi, 64 HP." },
      { b: "Datacenter", t: "Datacenter Globo.com", d: "Modificações nos sistemas de ar condicionado existentes, com medições das vazões de ar e água." },
      { b: "VRF Hitachi · 316 HP", t: "Medgrupo", d: "Projeto e instalação de ar condicionado no escritório, com sistema VRF Hitachi, 316 HP." },
      { b: "Retrofit CAC", t: "Shopping New Center", d: "Retrofit do ar condicionado: substituição das torres de arrefecimento, manutenção das bombas de condensação, reforma do quadro elétrico e troca de tubulações." },
      { b: "Centro cirúrgico · NBR 7256", t: "Hospital Tijutrauma", d: "Retrofit do centro cirúrgico e execução de quarto de isolamento conforme a NBR 7256." },
      { b: "Expansão direta", t: "Hospital Placi Botafogo — Expansão", d: "Ar condicionado de expansão direta com equipamentos especiais para quartos de isolamento, exaustão mecânica e pressurização de escada." },
      { b: "Água gelada · 200 TR", t: "Hospital Placi — Barra", d: "Retrofit do prédio para hospital. Expansão indireta (água gelada) com condensação a ar (200 TR), quartos de isolamento, exaustão de cozinha e pressurização de escada." },
      { b: "VRV LG · 48 HP", t: "Clínica Medsculp — Largo do Machado", d: "Instalação de sistema VRV LG (48 HP) e sistema especial Traydus de ar exterior." },
      { b: "VRV LG · 38 HP", t: "CEF — Cofre (Centro/RJ)", d: "Instalação de sistema VRV LG (38 HP), exaustão mecânica e renovação de ar exterior." },
      { b: "Água gelada · 140 TR", t: "Hospital Placi — Brasília", d: "Expansão indireta (água gelada) com condensação a ar (140 TR), quartos de isolamento, exaustão de cozinha e pressurização de escada." },
      { b: "Expansão direta · 20 TR", t: "Hospital Bangu D'Or", d: "Ar condicionado de expansão direta com condensação a ar (20 TR), com equipamentos especiais para a UTI Pediátrica." },
      { b: "VRF · 24 HP", t: "Hospital Real D'Or", d: "Ar condicionado VRF de expansão direta com condensação a ar (24 HP) para os consultórios da emergência pediátrica." },
      { b: "Exp. direta/indireta · 200+ TR", t: "Hospital Di Camp", d: "Ar condicionado de expansão direta e indireta (mais de 200 TR) para quartos de isolamento, UTIs, centro cirúrgico, hemodinâmica e CME, com exaustão mecânica e pressurização de escada." },
      { b: "Fan-Coil + Chiller", t: "Hospital Unimed — Barra", d: "Expansão indireta com Fan-Coils e controle de temperatura/umidade para a nova área de imagem, com chiller de processo para refrigeração do magneto." },
      { b: "Mini Split · VRF · Água gelada", t: "Lojas, academias, residências e escritórios", d: "Projetos de ar condicionado e ventilação mecânica para diversas lojas comerciais, academias, residências, apartamentos, escritórios e restaurantes. Sistemas mistos de Mini Split, Self-Contained, VRF e água gelada." }
    ];

    /* Gera os cards do carrossel a partir da lista acima */
    if (projetos.length) {
      var coverSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="9" rx="2"/><path d="M5 10h7"/><path d="M6 17c1.5 0 1.5 2 3 2M12 17c1.5 0 1.5 2 3 2"/></svg>';
      var frag = document.createDocumentFragment();
      projetos.forEach(function (p) {
        var li = document.createElement('li');
        li.className = p.f ? 'install-card install-card--featured' : 'install-card';

        var cover = document.createElement('div');
        cover.className = 'install-cover';
        cover.setAttribute('role', 'img');
        cover.setAttribute('aria-label', 'Projeto: ' + p.t);
        if (p.vid) {
          cover.className = 'install-cover install-cover--photo';
          var video = document.createElement('video');
          video.className = 'install-cover-video';
          video.src = p.vid;
          if (p.img) { video.poster = p.img; }
          video.loop = true;
          video.muted = true;
          video.setAttribute('muted', '');
          video.playsInline = true;
          video.setAttribute('playsinline', '');
          video.preload = 'auto';
          video.setAttribute('aria-hidden', 'true');
          video.setAttribute('tabindex', '-1');
          video.setAttribute('disablepictureinpicture', '');
          video.autoplay = true;
          video.setAttribute('autoplay', '');
          cover.appendChild(video);
          /* Garante o autoplay em loop, inclusive no celular */
          var pr = video.play();
          if (pr && pr.catch) {
            pr.catch(function () {
              var resume = function () { video.play().catch(function () {}); };
              document.addEventListener('touchstart', resume, { once: true, passive: true });
              document.addEventListener('click', resume, { once: true });
            });
          }
        } else if (p.img) {
          cover.className = 'install-cover install-cover--photo';
          cover.style.backgroundImage = 'url("' + p.img + '")';
          cover.style.backgroundSize = 'cover';
          cover.style.backgroundPosition = 'center';
        } else {
          cover.innerHTML = coverSvg;
        }
        var badge = document.createElement('span');
        badge.className = 'cover-badge';
        badge.textContent = p.b;
        cover.appendChild(badge);

        var body = document.createElement('div');
        body.className = 'install-body';
        var h3 = document.createElement('h3');
        h3.className = 'install-title';
        h3.textContent = p.t;
        var desc = document.createElement('p');
        desc.className = 'install-desc';
        desc.textContent = p.d;
        if (p.f) {
          var tag = document.createElement('span');
          tag.className = 'featured-tag';
          tag.innerHTML = '<span aria-hidden="true">★</span> Destaque';
          body.appendChild(tag);
        }
        body.appendChild(h3);
        body.appendChild(desc);

        li.appendChild(cover);
        li.appendChild(body);
        frag.appendChild(li);
      });
      track.innerHTML = '';
      track.appendChild(frag);
    }

    var stepSize = function () {
      var card = track.querySelector('.install-card');
      return card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    };
    var prevBtn = document.querySelector('.installs-nav--prev');
    var nextBtn = document.querySelector('.installs-nav--next');
    if (prevBtn) prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: stepSize(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---- Animações sutis ao rolar (fade-up) ---- */
  var reveals = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Traçado do processo de 3 etapas sincronizado com o scroll ---- */
  (function () {
    var process = document.getElementById('process');
    if (!process) { return; }
    var steps = process.querySelectorAll('.process-step');
    var rail = process.querySelector('.process-rail');
    var fill = process.querySelector('.process-fill');

    /* Posiciona o traçado exatamente do centro da 1ª ao centro da última bola
       (sem sobra no final), tanto na vertical (mobile) quanto na horizontal (desktop) */
    function layoutRail() {
      var icons = process.querySelectorAll('.process-icon');
      if (icons.length < 2 || !rail || !fill) { return; }
      var pr = process.getBoundingClientRect();
      var a = icons[0].getBoundingClientRect();
      var b = icons[icons.length - 1].getBoundingClientRect();
      var horizontal = window.matchMedia('(min-width: 768px)').matches;
      var box;
      if (horizontal) {
        var x1 = a.left + a.width / 2 - pr.left;
        var x2 = b.left + b.width / 2 - pr.left;
        var cy = a.top + a.height / 2 - pr.top;
        box = { left: x1 + 'px', top: (cy - 2) + 'px', width: (x2 - x1) + 'px', height: '4px' };
      } else {
        var cx = a.left + a.width / 2 - pr.left;
        var y1 = a.top + a.height / 2 - pr.top;
        var y2 = b.top + b.height / 2 - pr.top;
        box = { left: (cx - 2) + 'px', top: y1 + 'px', width: '4px', height: (y2 - y1) + 'px' };
      }
      [rail, fill].forEach(function (el) {
        el.style.left = box.left;
        el.style.top = box.top;
        el.style.width = box.width;
        el.style.height = box.height;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      });
    }

    layoutRail();
    window.addEventListener('resize', layoutRail, { passive: true });
    window.addEventListener('load', layoutRail);
    /* Recalcula quando o conteúdo reflui (ex.: fontes carregam e mudam a altura do texto) */
    if ('ResizeObserver' in window) {
      new ResizeObserver(layoutRail).observe(process.querySelector('.process-steps'));
    }

    function setProgress(p) {
      process.style.setProperty('--progress', p);
      var n = steps.length > 1 ? steps.length - 1 : 1;
      steps.forEach(function (step, i) {
        /* ativa cada etapa quando o traçado a alcança */
        step.classList.toggle('is-active', p >= (i / n) - 0.02);
      });
    }

    /* Movimento reduzido: mostra tudo desenhado/ativo, sem animar com o scroll */
    if (reduceMotion) { setProgress(1); return; }

    var ticking = false;
    function update() {
      ticking = false;
      var rect = process.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var start = vh * 0.82;                 /* começa a desenhar ao cruzar 82% da viewport */
      var span = rect.height + vh * 0.25;    /* distância de scroll para completar */
      var p = (start - rect.top) / span;
      setProgress(p < 0 ? 0 : (p > 1 ? 1 : p));
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* ---- Contadores da faixa de números (anima de 0 ao alvo ao entrar na viewport) ---- */
  (function () {
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) { return; }
    function format(n) { return n.toLocaleString('pt-BR'); }
    function animate(el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      if (reduceMotion) { el.textContent = prefix + format(target); return; }
      var dur = 1800, start = null;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);   /* easeOutCubic */
        el.textContent = prefix + format(Math.round(eased * target));
        if (p < 1) { requestAnimationFrame(step); }
        else { el.textContent = prefix + format(target); }
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { nums.forEach(animate); return; }
    function startObserver() {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      nums.forEach(function (el) { io.observe(el); });
    }
    /* No telefone: só começa a observar após o 1º scroll → não anima ao entrar no site */
    if (window.matchMedia('(max-width: 767px)').matches) {
      var onFirstScroll = function () {
        window.removeEventListener('scroll', onFirstScroll);
        startObserver();
      };
      window.addEventListener('scroll', onFirstScroll, { passive: true });
    } else {
      startObserver();
    }
  })();
})();
