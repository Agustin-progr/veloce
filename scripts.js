"use strict";

// VELOCE es un proyecto conceptual.
// Los precios y datos técnicos son ilustrativos.

const vehicles = [
  {
    id: "01",
    brand: "Porsche",
    name: "911 Carrera",
    category: "Deportivo",
    price: 185000,
    year: 2025,
    power: "388 CV",
    acceleration: "4,1 s",
    speed: "294 km/h",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
    description: "Un deportivo que combina una silueta inconfundible, ingeniería precisa y una experiencia de conducción pensada para disfrutar cada curva."
  },
  {
    id: "02",
    brand: "Mercedes-Benz",
    name: "AMG GT",
    category: "Deportivo",
    price: 145000,
    year: 2025,
    power: "469 CV",
    acceleration: "4,0 s",
    speed: "295 km/h",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85",
    description: "Proporciones atléticas, una cabina envolvente y un carácter que pone al conductor en el centro de la experiencia."
  },
  {
    id: "03",
    brand: "BMW",
    name: "M4 Competition",
    category: "Deportivo",
    price: 95000,
    year: 2025,
    power: "523 CV",
    acceleration: "3,4 s",
    speed: "250 km/h",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
    description: "Una interpretación contemporánea del deportivo de altas prestaciones: potencia, aplomo y precisión."
  },
  {
    id: "04",
    brand: "Range Rover",
    name: "Sport",
    category: "SUV",
    price: 110000,
    year: 2025,
    power: "395 CV",
    acceleration: "5,4 s",
    speed: "225 km/h",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    description: "Una presencia imponente que combina refinamiento, comodidad y versatilidad para cambiar de escenario."
  },
  {
    id: "05",
    brand: "BMW",
    name: "X5",
    category: "SUV",
    price: 72000,
    year: 2025,
    power: "375 CV",
    acceleration: "5,3 s",
    speed: "243 km/h",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=85",
    description: "Un SUV que equilibra espacio, tecnología y una conducción confortable tanto en ciudad como en ruta."
  },
  {
    id: "06",
    brand: "Mercedes-Benz",
    name: "Clase S",
    category: "Berlina",
    price: 120000,
    year: 2025,
    power: "442 CV",
    acceleration: "4,9 s",
    speed: "250 km/h",
    image: "https://images.unsplash.com/photo-1618843479618-39b7d7d9e3d5?auto=format&fit=crop&w=1200&q=85",
    description: "Una berlina de lujo enfocada en el confort, la tecnología y el cuidado de cada detalle."
  },
  {
    id: "07",
    brand: "Porsche",
    name: "Taycan",
    category: "Eléctrico",
    price: 100000,
    year: 2025,
    power: "408 CV",
    acceleration: "4,8 s",
    speed: "230 km/h",
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=1200&q=85",
    description: "Una lectura eléctrica del ADN deportivo: respuesta inmediata, diseño limpio y una experiencia silenciosa."
  },
  {
    id: "08",
    brand: "Tesla",
    name: "Model S",
    category: "Eléctrico",
    price: 80000,
    year: 2025,
    power: "670 CV",
    acceleration: "3,2 s",
    speed: "250 km/h",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=85",
    description: "Una berlina eléctrica de líneas minimalistas que propone una experiencia de conducción centrada en la tecnología."
  }
];

// Cambiá este valor por tu dirección de correo antes de publicar.
const CONTACT_EMAIL = "tu-correo@ejemplo.com";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const grid = $("#vehicleGrid");
const filters = $("#filters");
const search = $("#search");
const sort = $("#sort");
const resultCount = $("#resultCount");
const emptyState = $("#emptyState");
const dialog = $("#vehicleDialog");
const dialogContent = $("#dialogContent");

let activeCategory = "Todos";
let savedIds = loadSavedIds();

function loadSavedIds() {
  try {
    const data = JSON.parse(localStorage.getItem("veloce-favorites") || "[]");
    return new Set(Array.isArray(data) ? data : []);
  } catch {
    return new Set();
  }
}

function persistFavorites() {
  try {
    localStorage.setItem("veloce-favorites", JSON.stringify([...savedIds]));
  } catch {
    // La página sigue funcionando aunque el almacenamiento esté deshabilitado.
  }
}

function makeElement(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function getFilteredVehicles() {
  const query = search.value.trim().toLocaleLowerCase("es");

  const list = vehicles.filter((vehicle) => {
    const matchesCategory =
      activeCategory === "Todos" || vehicle.category === activeCategory;

    const searchable = `${vehicle.brand} ${vehicle.name} ${vehicle.category}`
      .toLocaleLowerCase("es");

    return matchesCategory && searchable.includes(query);
  });

  switch (sort.value) {
    case "asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name":
      list.sort((a, b) =>
        `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`, "es")
      );
      break;
    default:
      list.sort((a, b) => a.id.localeCompare(b.id));
  }

  return list;
}

function renderVehicles() {
  const list = getFilteredVehicles();

  grid.replaceChildren();

  list.forEach((vehicle, index) => {
    grid.append(createVehicleCard(vehicle, index));
  });

  resultCount.textContent =
    `${String(list.length).padStart(2, "0")} ` +
    (list.length === 1 ? "modelo" : "modelos");

  grid.hidden = list.length === 0;
  emptyState.hidden = list.length !== 0;
}

function createVehicleCard(vehicle, index) {
  const card = makeElement("article", "vehicle-card");
  card.style.animationDelay = `${Math.min(index * 45, 225)}ms`;

  const imageWrap = makeElement("div", "vehicle-image-wrap");
  const image = makeElement("img", "vehicle-image");

  image.src = vehicle.image;
  image.alt = `${vehicle.brand} ${vehicle.name}`;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.alt = "Imagen no disponible";
  }, { once: true });

  imageWrap.append(
    image,
    makeElement("span", "vehicle-tag", vehicle.category),
    makeElement("span", "vehicle-index", vehicle.id)
  );

  const info = makeElement("div", "vehicle-info");
  const brand = makeElement("p", "vehicle-brand", vehicle.brand);

  const nameRow = makeElement("div", "vehicle-name-row");
  nameRow.append(
    makeElement("h3", "vehicle-name", vehicle.name),
    makeElement("span", "vehicle-price", formatPrice(vehicle.price))
  );

  const specs = makeElement("div", "vehicle-specs");
  [String(vehicle.year), vehicle.power, vehicle.acceleration].forEach((value) => {
    specs.append(makeElement("span", "", value));
  });

  const actions = makeElement("div", "vehicle-actions");

  const details = makeElement("button", "details-button");
  details.type = "button";
  details.append(
    document.createTextNode("Explorar modelo "),
    makeElement("span", "", "↗")
  );
  details.addEventListener("click", () => openVehicleDialog(vehicle.id));

  const isSaved = savedIds.has(vehicle.id);
  const favorite = makeElement(
    "button",
    `save-button${isSaved ? " is-saved" : ""}`,
    isSaved ? "♥" : "♡"
  );

  favorite.type = "button";
  favorite.setAttribute("aria-pressed", String(isSaved));
  favorite.setAttribute(
    "aria-label",
    isSaved
      ? `Quitar ${vehicle.name} de favoritos`
      : `Guardar ${vehicle.name} en favoritos`
  );

  favorite.addEventListener("click", () => {
    if (savedIds.has(vehicle.id)) {
      savedIds.delete(vehicle.id);
    } else {
      savedIds.add(vehicle.id);
    }

    persistFavorites();
    renderVehicles();
  });

  actions.append(details, favorite);
  info.append(brand, nameRow, specs, actions);
  card.append(imageWrap, info);

  return card;
}

function openVehicleDialog(id) {
  const vehicle = vehicles.find((item) => item.id === id);
  if (!vehicle) return;

  dialogContent.replaceChildren();

  const layout = makeElement("div", "dialog-layout");
  const image = makeElement("img", "dialog-image");

  image.src = vehicle.image;
  image.alt = `${vehicle.brand} ${vehicle.name}`;
  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.alt = "Imagen no disponible";
  }, { once: true });

  const details = makeElement("div", "dialog-details");
  const title = makeElement("h2", "", vehicle.name);
  title.id = "dialogTitle";

  details.append(
    makeElement("p", "vehicle-brand", `${vehicle.brand} · ${vehicle.category}`),
    title,
    makeElement("p", "dialog-price", formatPrice(vehicle.price)),
    makeElement("p", "dialog-description", vehicle.description)
  );

  const specs = makeElement("div", "dialog-specs");

  [
    ["Año", String(vehicle.year)],
    ["Potencia", vehicle.power],
    ["0–100 km/h", vehicle.acceleration],
    ["Velocidad máxima", vehicle.speed],
    ["Transmisión", "Automática"],
    ["Categoría", vehicle.category]
  ].forEach(([label, value]) => {
    const cell = makeElement("div");
    cell.append(
      makeElement("span", "", label),
      makeElement("strong", "", value)
    );
    specs.append(cell);
  });

  const subject = encodeURIComponent(`Consulta sobre ${vehicle.brand} ${vehicle.name}`);
  const body = encodeURIComponent(
    `Hola, quisiera recibir más información sobre el ${vehicle.brand} ${vehicle.name} que vi en VELOCE.`
  );

  const contact = makeElement("a", "button button-dark", "Consultar por este modelo ↗");
  contact.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  details.append(specs, contact);
  layout.append(image, details);
  dialogContent.append(layout);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }

  document.body.classList.add("dialog-open");
}

function closeDialog() {
  if (typeof dialog.close === "function" && dialog.open) {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }

  document.body.classList.remove("dialog-open");
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  $$(".filter", filters).forEach((filter) => {
    const active = filter === button;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
  });

  renderVehicles();
});

search.addEventListener("input", renderVehicles);
sort.addEventListener("change", renderVehicles);

$("#reset").addEventListener("click", () => {
  activeCategory = "Todos";
  search.value = "";
  sort.value = "featured";

  $$(".filter", filters).forEach((filter) => {
    const active = filter.dataset.category === "Todos";
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
  });

  renderVehicles();
});

$("#closeDialog").addEventListener("click", closeDialog);

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
});

const menuToggle = $("#menuToggle");
const navigation = $("#navigation");

menuToggle.addEventListener("click", () => {
  const open = navigation.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

$$("a", navigation).forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  });
});

$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const subject = encodeURIComponent(`Consulta desde VELOCE — ${data.get("reason")}`);
  const body = encodeURIComponent(
    `Nombre: ${data.get("name")}\n` +
    `Correo: ${data.get("email")}\n` +
    `Motivo: ${data.get("reason")}\n\n` +
    `Mensaje:\n${data.get("message")}`
  );

  $("#formFeedback").textContent =
    "Se está preparando tu correo. Si no se abre, verificá que tengas una aplicación de correo configurada.";

  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

$("#year").textContent = new Date().getFullYear();

renderVehicles();