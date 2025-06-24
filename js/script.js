document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector("main");

  // --- FUNÇÕES DE INICIALIZAÇÃO MODULARES ---

  function inicializarMenuHamburguer(container) {
    const menuHamburguer = container.querySelector("#menu-hamburguer");
    const menuNavegacao = container.querySelector(".menu-navegacao");
    if (
      menuHamburguer &&
      menuNavegacao &&
      !menuHamburguer.dataset.initialized
    ) {
      menuHamburguer.addEventListener("click", () => {
        menuNavegacao.classList.toggle("ativo");
        menuHamburguer.classList.toggle("ativo");
      });
      menuHamburguer.dataset.initialized = "true";
    }
  }

  function inicializarLeiaMais(container) {
    container.addEventListener("click", (event) => {
      const button = event.target;
      const isReadMoreButton =
        button.classList.contains("btn-leia-mais") ||
        button.classList.contains("demo-read-more-btn");

      if (!isReadMoreButton) return;

      const isDemo = button.classList.contains("demo-read-more-btn");
      const article = isDemo
        ? button.closest(".demo-article")
        : button.closest(".conteudo-artigo");

      if (!article) return;

      const dots = article.querySelector(
        isDemo ? ".demo-dots" : ".pontos-suspensao"
      );
      const moreText = article.querySelector(
        isDemo ? ".demo-more-text" : ".texto-expandido"
      );

      if (dots && moreText) {
        const isCurrentlyHidden = moreText.classList.toggle("hidden");
        // O toggle retorna `true` se a classe foi adicionada (agora está visível),
        // e `false` se foi removida (agora está escondido).
        dots.classList.toggle("hidden");
        button.textContent = isCurrentlyHidden ? "Leia menos" : "Leia mais";
      }
    });
  }

  function configurarValidacaoFormulario(formNode) {
    if (!formNode || formNode.dataset.validated) return;
    const exibeErro = (input, mensagem) => {
      const erroDisplay = input.parentElement.querySelector(".mensagem-erro");
      if (erroDisplay) {
        input.classList.add("erro");
        erroDisplay.innerText = mensagem;
        erroDisplay.classList.add("visivel");
      }
    };
    const limpaTodosErros = () => {
      formNode
        .querySelectorAll(".erro")
        .forEach((c) => c.classList.remove("erro"));
      formNode
        .querySelectorAll(".mensagem-erro.visivel")
        .forEach((m) => m.classList.remove("visivel"));
    };
    formNode.addEventListener("submit", (event) => {
      event.preventDefault();
      limpaTodosErros();
      let ehFormularioValido = true;
      const nome = formNode.querySelector("#nome");
      const email = formNode.querySelector("#email");
      const mensagem = formNode.querySelector("#mensagem");
      if (!nome?.value.trim()) {
        exibeErro(nome, "O campo nome é obrigatório.");
        ehFormularioValido = false;
      }
      if (!email?.value.trim()) {
        exibeErro(email, "O campo e-mail é obrigatório.");
        ehFormularioValido = false;
      } else if (
        !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.value)
      ) {
        exibeErro(email, "Por favor, insira um e-mail válido.");
        ehFormularioValido = false;
      }
      if (!mensagem?.value.trim()) {
        exibeErro(mensagem, "O campo mensagem não pode ficar em branco.");
        ehFormularioValido = false;
      }
      if (ehFormularioValido) {
        const feedback = formNode.querySelector("#feedback-sucesso");
        if (feedback) {
          feedback.textContent =
            "Mensagem enviada com sucesso! Obrigado pelo contato.";
          feedback.classList.add("visivel");
          formNode.reset();
          setTimeout(() => feedback.classList.remove("visivel"), 5000);
        }
      }
    });
    formNode.dataset.validated = "true";
  }

  function inicializarScriptsRelatorio(container) {
    const featuresChartCanvas = container.querySelector("#featuresChart");
    if (featuresChartCanvas && typeof Chart !== "undefined") {
      if (Chart.getChart(featuresChartCanvas)) {
        Chart.getChart(featuresChartCanvas).destroy();
      }
      new Chart(featuresChartCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ["Layout & UI", "Interatividade", "Validação", "Navegação"],
          datasets: [
            {
              data: [2, 1, 1, 1],
              backgroundColor: ["#14b8a6", "#f59e0b", "#38bdf8", "#6366f1"],
              borderColor: "#fff",
              borderWidth: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
      });
    }

    const sitemapNodes = container.querySelectorAll(".sitemap-node");
    const sitemapInfo = container.querySelector("#sitemap-info");
    if (sitemapInfo && sitemapNodes.length > 0) {
      const originalInfoText = sitemapInfo.textContent;
      sitemapNodes.forEach((node) => {
        const newNode = node.cloneNode(true);
        node.parentNode.replaceChild(newNode, node);
        newNode.addEventListener("mouseenter", () => {
          sitemapInfo.textContent = newNode.dataset.info;
          sitemapInfo.style.opacity = 1;
        });
        newNode.addEventListener("mouseleave", () => {
          sitemapInfo.textContent = originalInfoText;
          sitemapInfo.style.opacity = 0;
        });
      });
    }

    const subNav = container.querySelector("#sub-header-relatorio");
    if (subNav) {
      const subNavLinks = container.querySelectorAll(".sub-nav-link");
      const sections = container.querySelectorAll(".relatorio-secao");
      if (sections.length > 0 && typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                subNavLinks.forEach((link) => {
                  link.classList.remove("active-sub-link");
                  if (link.getAttribute("href") === `#${id}`) {
                    link.classList.add("active-sub-link");
                  }
                });
              }
            });
          },
          { rootMargin: "-40% 0px -60% 0px" }
        );
        sections.forEach((section) => observer.observe(section));
      }
    }

    // Lógica de validação em tempo real para o formulário de DEMONSTRAÇÃO
    const demoForm = container.querySelector("#demo-contact-form");
    if (demoForm && !demoForm.dataset.realtime) {
      const nameInput = demoForm.querySelector("#demo-name");
      const emailInput = demoForm.querySelector("#demo-email");
      const messageInput = demoForm.querySelector("#demo-message");
      const successMsg = demoForm.querySelector("#demo-success-msg");

      const validateField = (input) => {
        const errorEl = input.parentElement.querySelector(".demo-error-msg");
        let message = null;
        const value = input.value.trim();

        if (input.id === "demo-name" && !value) {
          message = "O campo nome é obrigatório.";
        } else if (input.id === "demo-email") {
          if (!value) {
            message = "O campo e-mail é obrigatório.";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = "Por favor, insira um e-mail válido.";
          }
        } else if (input.id === "demo-message" && !value) {
          message = "O campo mensagem não pode ficar em branco.";
        }

        if (message) {
          errorEl.textContent = message;
          errorEl.style.display = "block";
          return false;
        }
        errorEl.textContent = "";
        errorEl.style.display = "none";
        return true;
      };

      [nameInput, emailInput, messageInput].forEach((input) => {
        input.addEventListener("input", () => validateField(input));
      });

      demoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const isNameValid = validateField(nameInput);
        const isEmailValid = validateField(emailInput);
        const isMessageValid = validateField(messageInput);

        if (isNameValid && isEmailValid && isMessageValid) {
          successMsg.textContent =
            "Mensagem enviada com sucesso! (Demonstração)";
          successMsg.style.display = "block";
          demoForm.reset();
          setTimeout(() => {
            successMsg.style.display = "none";
          }, 5000);
        }
      });
      demoForm.dataset.realtime = "true";
    }
  }

  // --- FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO DE PÁGINA ---
  function inicializarScriptsDaPagina(container) {
    inicializarMenuHamburguer(container.querySelector("header") || document);
    inicializarLeiaMais(container);
    configurarValidacaoFormulario(container.querySelector("#form-contato"));
    if (container.querySelector(".container-relatorio")) {
      inicializarScriptsRelatorio(container);
    }
  }

  // --- LÓGICA DE ROLAGEM INFINITA ---
  const paginas = ["index.html", "artigos.html", "sobre.html", "contato.html"];
  const nomeArquivoAtual =
    window.location.pathname.split("/").pop() || "index.html";

  // Apenas inicializa a rolagem infinita se a página atual estiver na sequência principal.
  // Isso evita que a rolagem seja ativada em páginas como 'relatorio.html'.
  if (paginas.includes(nomeArquivoAtual)) {
    let paginasCarregadas = [nomeArquivoAtual];
    let carregando = false;

    const carregarPagina = async (url, direcao) => {
      if (carregando || paginasCarregadas.includes(url)) return;
      carregando = true;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao carregar ${url}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const novoMain = doc.querySelector("main");

        if (novoMain && mainContainer) {
          // Cria um container <section> para encapsular todo o conteúdo da nova página.
          // Isso garante que todos os elementos (como o sub-header do relatório)
          // sejam mantidos juntos e que os scripts possam encontrá-los.
          const pageWrapper = document.createElement("section");
          pageWrapper.dataset.pageUrl = url; // Útil para depuração

          // Verifica se existe um sub-header especial (usado na página de relatório) e o adiciona.
          const novoSubHeader = doc.querySelector("#sub-header-relatorio");
          if (novoSubHeader) {
            pageWrapper.appendChild(novoSubHeader);
          }

          // Adiciona o conteúdo principal da página carregada dentro do wrapper.
          const contentDiv = document.createElement("div");
          contentDiv.className = novoMain.className;
          while (novoMain.firstChild) {
            contentDiv.appendChild(novoMain.firstChild);
          }
          pageWrapper.appendChild(contentDiv);

          const separador = document.createElement("hr");
          separador.className = "separador-pagina-carregada";
          const primeiroElementoAntigo = mainContainer.firstChild;

          if (direcao === "baixo") {
            mainContainer.appendChild(separador);
            mainContainer.appendChild(pageWrapper);
          } else {
            mainContainer.prepend(pageWrapper);
            mainContainer.prepend(separador);
            if (primeiroElementoAntigo) {
              primeiroElementoAntigo.scrollIntoView();
            }
          }

          if (direcao === "baixo") {
            paginasCarregadas.push(url);
          } else {
            paginasCarregadas.unshift(url);
          }

          // Atualiza o título da página e a URL na barra de endereço
          const novoTitulo = doc.querySelector("title").textContent;
          document.title = novoTitulo;
          history.pushState({ path: url }, novoTitulo, url);

          inicializarScriptsDaPagina(pageWrapper);
        }
      } catch (error) {
        console.error(`Falha ao carregar a página (${direcao}):`, error);
      } finally {
        carregando = false;
      }
    };

    window.addEventListener("scroll", () => {
      if (carregando) return;
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const indiceUltimaPagina = paginas.indexOf(
        paginasCarregadas[paginasCarregadas.length - 1]
      );
      const indicePrimeiraPagina = paginas.indexOf(paginasCarregadas[0]);

      if (
        clientHeight + scrollTop >= scrollHeight - 500 &&
        indiceUltimaPagina < paginas.length - 1
      ) {
        carregarPagina(paginas[indiceUltimaPagina + 1], "baixo");
      }
      if (scrollTop <= 150 && indicePrimeiraPagina > 0) {
        carregarPagina(paginas[indicePrimeiraPagina - 1], "cima");
      }
    });
  }

  // --- INICIALIZAÇÃO INICIAL DA PÁGINA CARREGADA ---
  inicializarScriptsDaPagina(document.body);
});
