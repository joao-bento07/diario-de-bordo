# ⚓ Diário de Bordo — PWA

Aplicativo Web Progressivo para registro de atividades diárias.  
Funciona offline, pode ser instalado na tela inicial e persiste dados localmente.

🔗 **Live:** https://joao-bento07.github.io/diario-de-bordo/

---

## 🔍 Gargalos identificados (análise inicial)

| Problema | Detalhe |
|---|---|
| Fontes bloqueando renderização | Google Fonts carregando de forma síncrona |
| Imagens em PNG | Ícones nos formatos `.png` sem otimização |
| CSS/JS não minificados | Arquivos com comentários, espaços e código de desenvolvimento |
| Service Worker sem cache dinâmico | Só fazia cache estático na instalação |
| Pesos de fonte desnecessários | Carregava 4 pesos quando usava apenas 2 |

---

## ✅ Melhorias aplicadas

| Técnica | Impacto |
|---|---|
| Fontes com `preload` + `font-display:swap` | Elimina bloqueio de renderização |
| Ícones convertidos de `.png` para `.webp` | Redução de ~30% no tamanho dos arquivos |
| CSS minificado (`style.min.css`) | Redução de ~40% no tamanho do arquivo |
| JS minificado (`script.min.js`) | Redução de ~35% no tamanho do arquivo |
| `defer` no script | JS não bloqueia mais o parsing do HTML |
| Service Worker com cache dinâmico | Melhor cobertura offline e performance |
| Removidos pesos de fonte não usados | Menos dados transferidos |
| Atributo `autocomplete="off"` | Evita processamento desnecessário do browser |

---

## 📊 Comparativo antes × depois

### Antes
![Lighthouse antes](reports/before.png)

| Métrica | Valor |
|---|---|
| Performance | 93 |
| Accessibility | 100 |
| Best Practices | 96 |
| SEO | 100 |

### Depois
![Lighthouse depois](reports/after.png)

| Métrica | Valor |
|---|---|
| Performance | 99+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## 🛠 Tecnologias

- HTML5 semântico
- CSS3 com variáveis customizadas
- JavaScript vanilla (ES6+)
- PWA: Service Worker + Web App Manifest
- localStorage para persistência