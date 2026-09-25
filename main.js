/* ==========================================================
   Motor de la terminal
   ========================================================== */
(function () {
  "use strict";

  const DATA = window.PORTFOLIO;
  const P = DATA.profile;
  const HOST = `${P.handle || "guest"}@portfolio`;
  const PROMPT = `${HOST}:~$`;

  const $ = (sel) => document.querySelector(sel);
  const output = $("#output");
  const screen = $("#screen");
  const input = $("#cmd-input");
  const form = $("#prompt-form");
  const before = $("#typed-before");
  const cursorEl = $("#cursor");
  const after = $("#typed-after");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cmdHistory = [];
  let historyIndex = 0;
  let busy = false;
  let skip = false;

  const BANNER = String.raw`
 ____   ___  ____ _____  _    _____ ___  _     ___ ___
|  _ \ / _ \|  _ \_   _|/ \  |  ___/ _ \| |   |_ _/ _ \
| |_) | | | | |_) || | / _ \ | |_ | | | | |    | | | | |
|  __/| |_| |  _ < | |/ ___ \|  _|| |_| | |___ | | |_| |
|_|    \___/|_| \_\|_/_/   \_\_|   \___/|_____|___\___/
`.replace(/^\n/, "");

  /* ---------- Utilidades de DOM ---------- */
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function line(text, cls) {
    return el("p", "line" + (cls ? " " + cls : ""), text);
  }

  // Construye una línea a partir de partes: strings, nodos o {text, cls, href}
  function rich(parts, cls) {
    const p = el("p", "line" + (cls ? " " + cls : ""));
    parts.forEach((part) => {
      if (part == null) return;
      if (typeof part === "string") p.appendChild(document.createTextNode(part));
      else if (part instanceof Node) p.appendChild(part);
      else if (part.href) p.appendChild(link(part.text, part.href));
      else p.appendChild(el("span", part.cls, part.text));
    });
    return p;
  }

  function link(text, href) {
    const a = el("a", null, text);
    a.href = href;
    if (/^https?:/.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function gap() {
    return el("div", "gap");
  }

  function heading(text) {
    const bar = "=".repeat(Math.min(text.length + 4, 40));
    const wrap = el("div");
    wrap.appendChild(line(`>> ${text.toUpperCase()}`, "heading"));
    wrap.appendChild(line(bar, "dim"));
    return wrap;
  }

  function cmdButton(cmd) {
    const b = el("button", null, cmd);
    b.type = "button";
    b.addEventListener("click", () => submit(cmd));
    return b;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function scrollToBottom() {
    screen.scrollTop = screen.scrollHeight;
  }

  // Imprime nodos uno a uno con un pequeño retardo (efecto de tipeo por línea)
  async function print(nodes, delay = 22) {
    for (const node of [].concat(nodes)) {
      output.appendChild(node);
      scrollToBottom();
      if (!skip && !reducedMotion && delay > 0) await sleep(delay);
    }
  }

  // Tipea texto carácter a carácter (solo para mensajes cortos)
  async function typeLine(text, cls, speed = 18) {
    const p = line("", cls);
    output.appendChild(p);
    if (skip || reducedMotion) {
      p.textContent = text;
    } else {
      for (const ch of text) {
        p.textContent += ch;
        scrollToBottom();
        if (skip) { p.textContent = text; break; }
        await sleep(speed);
      }
    }
    scrollToBottom();
  }

  function setBusy(value) {
    busy = value;
    form.classList.toggle("busy", value);
    if (!value) {
      skip = false;
      input.focus({ preventScroll: true });
      scrollToBottom();
    }
  }

  /* ---------- Render de secciones ---------- */
  function renderBanner() {
    return [
      el("pre", "pre banner", BANNER),
      rich([{ text: P.name, cls: "accent" }, " — ", P.role]),
    ];
  }

  function renderAbout() {
    const nodes = [heading("Sobre mí")];
    nodes.push(rich([{ text: "nombre   : ", cls: "dim" }, P.name]));
    nodes.push(rich([{ text: "rol      : ", cls: "dim" }, P.role]));
    nodes.push(rich([{ text: "ubicación: ", cls: "dim" }, P.location]));
    nodes.push(gap());
    P.bio.forEach((para) => {
      nodes.push(line(para));
      nodes.push(gap());
    });
    nodes.push(rich([{ text: "Tip: ", cls: "dim" }, "escribe ", cmdButtonInline("projects"), " o ", cmdButtonInline("contact"), "."]));
    return nodes;
  }

  function cmdButtonInline(cmd) {
    const b = cmdButton(cmd);
    b.className = "inline-cmd";
    return b;
  }

  function renderProjects() {
    const nodes = [heading("Proyectos"), line(`${DATA.projects.length} repositorios encontrados.`, "dim")];
    DATA.projects.forEach((proj, i) => {
      const block = el("div", "block");
      block.appendChild(rich([{ text: `[${String(i + 1).padStart(2, "0")}] `, cls: "dim" }, { text: proj.name, cls: "title" }]));
      block.appendChild(line(proj.description));
      const tags = el("p", "line");
      proj.stack.forEach((t) => tags.appendChild(el("span", "tag", t)));
      block.appendChild(tags);
      const links = [];
      if (proj.link) links.push({ text: "código", href: proj.link });
      if (proj.demo) links.push({ text: "demo", href: proj.demo });
      if (links.length) {
        const parts = [{ text: "-> ", cls: "dim" }];
        links.forEach((l, j) => { if (j) parts.push("  "); parts.push(l); });
        block.appendChild(rich(parts));
      }
      nodes.push(block);
    });
    return nodes;
  }

  function renderExperience() {
    const nodes = [heading("Experiencia")];
    DATA.experience.forEach((job) => {
      const block = el("div", "block");
      block.appendChild(rich([{ text: job.role, cls: "title" }, { text: " @ ", cls: "dim" }, job.company]));
      block.appendChild(line(job.period, "dim"));
      job.achievements.forEach((a) => block.appendChild(line(`  * ${a}`)));
      nodes.push(block);
    });
    return nodes;
  }

  function bar(level) {
    const size = 20;
    const n = Math.round((Math.max(0, Math.min(100, level)) / 100) * size);
    return `[${"█".repeat(n)}${"░".repeat(size - n)}] ${String(level).padStart(3)}%`;
  }

  function renderSkills() {
    const nodes = [heading("Habilidades")];
    DATA.skills.forEach((group) => {
      nodes.push(line(`# ${group.category}`, "accent"));
      group.items.forEach((s) => {
        const row = el("p", "line skill-row");
        row.appendChild(el("span", "skill-name", `  ${s.name}`));
        row.appendChild(el("span", null, bar(s.level)));
        nodes.push(row);
      });
      nodes.push(gap());
    });
    return nodes;
  }

  function renderCourses() {
    const nodes = [heading("Cursos y certificaciones")];
    DATA.courses.forEach((c) => {
      const block = el("div", "block");
      block.appendChild(rich([{ text: c.name, cls: "title" }]));
      const meta = [{ text: `${c.institution} · ${c.year}`, cls: "dim" }];
      if (c.link && c.link !== "#") meta.push("  ", { text: "certificado", href: c.link });
      block.appendChild(rich(meta));
      nodes.push(block);
    });
    return nodes;
  }

  function renderContact() {
    const nodes = [heading("Contacto")];
    nodes.push(rich([{ text: "email    : ", cls: "dim" }, { text: P.email, href: `mailto:${P.email}` }]));
    P.links.forEach((l) => {
      nodes.push(rich([{ text: `${l.label.toLowerCase().padEnd(9)}: `, cls: "dim" }, { text: l.url, href: l.url }]));
    });
    return nodes;
  }

  /* ---------- Sistema de archivos falso ---------- */
  const FILES = {
    "sobre_mi.txt": "about",
    "proyectos/": "projects",
    "experiencia.log": "experience",
    "habilidades.cfg": "skills",
    "cursos.md": "courses",
    "contacto.vcf": "contact",
  };

  /* ---------- Comandos ---------- */
  const COMMANDS = {
    help: {
      desc: "muestra esta ayuda",
      run: () => {
        const grid = el("div", "help-grid");
        Object.entries(COMMANDS).forEach(([name, c]) => {
          if (c.hidden) return;
          grid.appendChild(cmdButton(name));
          grid.appendChild(el("span", "d", c.desc + (c.aliases ? `  (alias: ${c.aliases.join(", ")})` : "")));
        });
        return [
          heading("Comandos disponibles"),
          grid,
          gap(),
          line("Atajos: ↑/↓ historial · Tab autocompletar · Ctrl+L limpiar · clic en un comando para ejecutarlo", "dim"),
        ];
      },
    },
    about: { desc: "quién soy", aliases: ["sobremi", "whoami"], run: renderAbout },
    projects: { desc: "proyectos destacados", aliases: ["proyectos"], run: renderProjects },
    experience: { desc: "experiencia laboral", aliases: ["experiencia"], run: renderExperience },
    skills: { desc: "habilidades técnicas", aliases: ["habilidades"], run: renderSkills },
    courses: { desc: "cursos y certificaciones", aliases: ["cursos"], run: renderCourses },
    contact: { desc: "cómo contactarme", aliases: ["contacto"], run: renderContact },
    ls: {
      desc: "lista los archivos",
      run: () => {
        const p = el("p", "line");
        Object.keys(FILES).forEach((f, i) => {
          if (i) p.appendChild(document.createTextNode("   "));
          const b = cmdButtonInline(`cat ${f}`);
          b.textContent = f;
          p.appendChild(b);
        });
        return [p];
      },
    },
    cat: {
      desc: "muestra un archivo (ej: cat cursos.md)",
      run: (args) => {
        if (!args[0]) return [line("uso: cat <archivo>   (prueba 'ls')", "warn")];
        const target = FILES[args[0]] || FILES[args[0] + "/"];
        if (!target) return [line(`cat: ${args[0]}: No existe el archivo o el directorio`, "err")];
        return COMMANDS[target].run([]);
      },
    },
    banner: { desc: "muestra el banner", run: renderBanner },
    history: {
      desc: "historial de comandos",
      run: () => cmdHistory.length
        ? cmdHistory.map((h, i) => line(`${String(i + 1).padStart(4)}  ${h}`))
        : [line("historial vacío", "dim")],
    },
    date: { desc: "fecha y hora actual", run: () => [line(new Date().toLocaleString("es"))] },
    echo: { desc: "repite un texto", run: (args, raw) => [line(raw.replace(/^\s*echo\s?/, ""))] },
    clear: { desc: "limpia la pantalla", aliases: ["cls"], run: () => { output.replaceChildren(); return []; } },
    reboot: { desc: "reinicia la terminal", run: () => { reboot(); return null; } },
    sudo: {
      hidden: true,
      run: () => [line(`${P.handle} no está en el archivo sudoers. Este incidente será reportado.`, "err")],
    },
    exit: { hidden: true, run: () => [line("No hay salida. Solo más código. (prueba 'reboot')", "warn")] },
    cd: { hidden: true, run: () => [line("cd: aquí todo está en ~ — usa 'ls' y 'cat'", "dim")] },
    pwd: { hidden: true, run: () => [line(`/home/${P.handle}`)] },
    rm: { hidden: true, run: () => [line("rm: operación no permitida. Buen intento ;)", "err")] },
  };

  // Mapa de alias -> comando
  const ALIASES = {};
  Object.entries(COMMANDS).forEach(([name, c]) => (c.aliases || []).forEach((a) => (ALIASES[a] = name)));

  function resolve(name) {
    return COMMANDS[name] ? name : ALIASES[name];
  }

  /* ---------- Ejecución ---------- */
  function echoCommand(raw) {
    output.appendChild(rich([{ text: PROMPT, cls: "prompt" }, " ", raw], "cmd-echo"));
  }

  async function submit(raw) {
    if (busy) return;
    raw = raw.trim();
    input.value = "";
    renderInput();
    echoCommand(raw);
    if (!raw) { scrollToBottom(); return; }

    cmdHistory.push(raw);
    historyIndex = cmdHistory.length;

    const [name, ...args] = raw.split(/\s+/);
    const key = resolve(name.toLowerCase());

    setBusy(true);
    if (!key) {
      await print(line(`comando no encontrado: ${name}. Escribe 'help' para ver los comandos.`, "err"));
    } else {
      const nodes = COMMANDS[key].run(args, raw);
      if (nodes === null) return; // el comando gestiona su propio estado (reboot)
      if (nodes.length) await print(nodes);
      updateHash(key);
    }
    await print(gap(), 0);
    setBusy(false);
  }

  // Refleja la sección actual en la URL para poder compartir enlaces (#projects)
  function updateHash(key) {
    if (["about", "projects", "experience", "skills", "courses", "contact"].includes(key)) {
      try { window.history.replaceState(null, "", `#${key}`); } catch (_) { /* file:// puede fallar */ }
    }
  }

  /* ---------- Autocompletado ---------- */
  function autocomplete() {
    const value = input.value;
    const parts = value.split(/\s+/);
    let candidates;
    let prefix;
    if (parts.length > 1 && resolve(parts[0]) === "cat") {
      prefix = parts.slice(1).join(" ");
      candidates = Object.keys(FILES).filter((f) => f.startsWith(prefix));
      if (candidates.length === 1) input.value = `${parts[0]} ${candidates[0]}`;
    } else {
      prefix = value.toLowerCase();
      const all = Object.keys(COMMANDS).filter((c) => !COMMANDS[c].hidden).concat(Object.keys(ALIASES));
      candidates = all.filter((c) => c.startsWith(prefix));
      if (candidates.length === 1) input.value = candidates[0] + " ";
    }
    if (candidates.length > 1) {
      echoCommand(value);
      output.appendChild(line(candidates.join("   "), "dim"));
      scrollToBottom();
    }
    renderInput();
  }

  /* ---------- Entrada visible ---------- */
  function renderInput() {
    const v = input.value;
    const pos = input.selectionStart ?? v.length;
    before.textContent = v.slice(0, pos);
    cursorEl.textContent = v[pos] || " ";
    after.textContent = v.slice(pos + 1);
  }

  input.addEventListener("input", renderInput);
  input.addEventListener("keyup", renderInput);
  input.addEventListener("click", renderInput);
  input.addEventListener("focus", () => form.classList.add("focused"));
  input.addEventListener("blur", () => form.classList.remove("focused"));

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) historyIndex--;
      input.value = cmdHistory[historyIndex] || "";
      setTimeout(() => { input.setSelectionRange(input.value.length, input.value.length); renderInput(); });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < cmdHistory.length) historyIndex++;
      input.value = cmdHistory[historyIndex] || "";
      renderInput();
    } else if (e.key === "Tab") {
      e.preventDefault();
      autocomplete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      output.replaceChildren();
    } else if (e.key === "c" && e.ctrlKey && !window.getSelection().toString()) {
      e.preventDefault();
      echoCommand(input.value + "^C");
      input.value = "";
      renderInput();
      scrollToBottom();
    }
    requestAnimationFrame(renderInput);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submit(input.value);
  });

  // Botones de la barra superior
  document.querySelectorAll(".shortcuts [data-cmd]").forEach((b) => {
    b.addEventListener("click", () => submit(b.dataset.cmd));
  });

  // Clic en la pantalla enfoca el input (sin romper la selección de texto)
  screen.addEventListener("mouseup", (e) => {
    if (e.target.closest("a, button")) return;
    if (window.getSelection().toString()) return;
    input.focus({ preventScroll: true });
  });

  // Durante animaciones, cualquier tecla o clic las acelera
  document.addEventListener("keydown", () => { if (busy) skip = true; });
  screen.addEventListener("click", () => { if (busy) skip = true; });

  /* ---------- Reloj ---------- */
  const clock = $("#clock");
  function tick() {
    clock.textContent = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  }
  tick();
  setInterval(tick, 15000);

  /* ---------- Arranque ---------- */
  async function boot() {
    setBusy(true);
    output.replaceChildren();
    const steps = [
      "Iniciando PORTFOLIO-OS v1.0 ...",
      "Comprobando memoria ............ 640K OK",
      "Cargando módulo sobre_mi ....... [ OK ]",
      "Cargando módulo proyectos ...... [ OK ]",
      "Cargando módulo experiencia .... [ OK ]",
      "Cargando módulo habilidades .... [ OK ]",
      "Cargando módulo cursos ......... [ OK ]",
      "Estableciendo conexión ......... [ OK ]",
    ];
    for (const s of steps) {
      await print(line(s, "dim"), 0);
      if (!skip && !reducedMotion) await sleep(90 + Math.random() * 120);
    }
    await print(gap(), 0);
    await print(renderBanner(), 35);
    await print(gap(), 0);
    await typeLine(`Bienvenido/a. Escribe 'help' para ver los comandos disponibles.`, "accent");
    await print(line("O usa los botones de arriba si prefieres no teclear.", "dim"));
    await print(gap(), 0);
    setBusy(false);

    // Abre la sección indicada en la URL (#projects, #skills, ...)
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && resolve(hash)) submit(hash);
  }

  function reboot() {
    const crt = document.querySelector(".crt");
    crt.classList.add("off");
    setTimeout(() => {
      crt.classList.remove("off");
      cmdHistory.length = 0;
      historyIndex = 0;
      busy = false;
      boot();
    }, reducedMotion ? 0 : 700);
  }

  $("#prompt-label").textContent = PROMPT;
  $("#titlebar-text").textContent = `${HOST}: ~`;
  document.title = `${P.name} — Terminal`;
  renderInput();
  boot();
})();
