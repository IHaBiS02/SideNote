var hu = (n) => {
  throw TypeError(n);
};
var vr = (n, e, t) => e.has(n) || hu("Cannot " + t);
var x = (n, e, t) => (vr(n, e, "read from private field"), t ? t.call(n) : e.get(n)), z = (n, e, t) => e.has(n) ? hu("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), v = (n, e, t, r) => (vr(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t), _ = (n, e, t) => (vr(n, e, "access private method"), t);
const Zn = globalThis, Ri = Zn.ShadowRoot && (Zn.ShadyCSS === void 0 || Zn.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Bi = /* @__PURE__ */ Symbol(), du = /* @__PURE__ */ new WeakMap();
let Gs = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Bi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Ri && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = du.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && du.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ca = (n) => new Gs(typeof n == "string" ? n : n + "", void 0, Bi), Da = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((r, i, u) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[u + 1], n[0]);
  return new Gs(t, n, Bi);
}, Sa = (n, e) => {
  if (Ri) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = Zn.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
  }
}, pu = Ri ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Ca(t);
})(n) : n;
const { is: Ea, defineProperty: _a, getOwnPropertyDescriptor: wa, getOwnPropertyNames: Aa, getOwnPropertySymbols: Ma, getPrototypeOf: Ta } = Object, xr = globalThis, mu = xr.trustedTypes, Oa = mu ? mu.emptyScript : "", Na = xr.reactiveElementPolyfillSupport, Jt = (n, e) => n, ai = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? Oa : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, Ys = (n, e) => !Ea(n, e), gu = { attribute: !0, type: String, converter: ai, reflect: !1, useDefault: !1, hasChanged: Ys };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), xr.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Ct = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = gu) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && _a(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: u } = wa(this.prototype, e) ?? { get() {
      return this[t];
    }, set(s) {
      this[t] = s;
    } };
    return { get: i, set(s) {
      const o = i?.call(this);
      u?.call(this, s), this.requestUpdate(e, o, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? gu;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Jt("elementProperties"))) return;
    const e = Ta(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Jt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Jt("properties"))) {
      const t = this.properties, r = [...Aa(t), ...Ma(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(pu(i));
    } else e !== void 0 && t.push(pu(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Sa(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const u = (r.converter?.toAttribute !== void 0 ? r.converter : ai).toAttribute(t, r.type);
      this._$Em = e, u == null ? this.removeAttribute(i) : this.setAttribute(i, u), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const u = r.getPropertyOptions(i), s = typeof u.converter == "function" ? { fromAttribute: u.converter } : u.converter?.fromAttribute !== void 0 ? u.converter : ai;
      this._$Em = i;
      const o = s.fromAttribute(t, u.type);
      this[i] = o ?? this._$Ej?.get(i) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, i = !1, u) {
    if (e !== void 0) {
      const s = this.constructor;
      if (i === !1 && (u = this[e]), r ??= s.getPropertyOptions(e), !((r.hasChanged ?? Ys)(u, t) || r.useDefault && r.reflect && u === this._$Ej?.get(e) && !this.hasAttribute(s._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: u }, s) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, s ?? t ?? this[e]), u !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, u] of this._$Ep) this[i] = u;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, u] of r) {
        const { wrapped: s } = u, o = this[i];
        s !== !0 || this._$AL.has(i) || o === void 0 || this.C(i, void 0, u, o);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Ct.elementStyles = [], Ct.shadowRootOptions = { mode: "open" }, Ct[Jt("elementProperties")] = /* @__PURE__ */ new Map(), Ct[Jt("finalized")] = /* @__PURE__ */ new Map(), Na?.({ ReactiveElement: Ct }), (xr.reactiveElementVersions ??= []).push("2.1.2");
const $i = globalThis, bu = (n) => n, ir = $i.trustedTypes, xu = ir ? ir.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Xs = "$lit$", Le = `lit$${Math.random().toFixed(9).slice(2)}$`, Qs = "?" + Le, Fa = `<${Qs}>`, pt = document, tn = () => pt.createComment(""), nn = (n) => n === null || typeof n != "object" && typeof n != "function", Pi = Array.isArray, va = (n) => Pi(n) || typeof n?.[Symbol.iterator] == "function", Ir = `[ 	
\f\r]`, Lt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yu = /-->/g, ku = />/g, tt = RegExp(`>|${Ir}(?:([^\\s"'>=/]+)(${Ir}*=${Ir}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Cu = /'/g, Du = /"/g, eo = /^(?:script|style|textarea|title)$/i, Ia = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), Rr = Ia(1), Ot = /* @__PURE__ */ Symbol.for("lit-noChange"), V = /* @__PURE__ */ Symbol.for("lit-nothing"), Su = /* @__PURE__ */ new WeakMap(), it = pt.createTreeWalker(pt, 129);
function to(n, e) {
  if (!Pi(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xu !== void 0 ? xu.createHTML(e) : e;
}
const Ra = (n, e) => {
  const t = n.length - 1, r = [];
  let i, u = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = Lt;
  for (let o = 0; o < t; o++) {
    const l = n[o];
    let a, c, f = -1, d = 0;
    for (; d < l.length && (s.lastIndex = d, c = s.exec(l), c !== null); ) d = s.lastIndex, s === Lt ? c[1] === "!--" ? s = yu : c[1] !== void 0 ? s = ku : c[2] !== void 0 ? (eo.test(c[2]) && (i = RegExp("</" + c[2], "g")), s = tt) : c[3] !== void 0 && (s = tt) : s === tt ? c[0] === ">" ? (s = i ?? Lt, f = -1) : c[1] === void 0 ? f = -2 : (f = s.lastIndex - c[2].length, a = c[1], s = c[3] === void 0 ? tt : c[3] === '"' ? Du : Cu) : s === Du || s === Cu ? s = tt : s === yu || s === ku ? s = Lt : (s = tt, i = void 0);
    const p = s === tt && n[o + 1].startsWith("/>") ? " " : "";
    u += s === Lt ? l + Fa : f >= 0 ? (r.push(a), l.slice(0, f) + Xs + l.slice(f) + Le + p) : l + Le + (f === -2 ? o : p);
  }
  return [to(n, u + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class rn {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let u = 0, s = 0;
    const o = e.length - 1, l = this.parts, [a, c] = Ra(e, t);
    if (this.el = rn.createElement(a, r), it.currentNode = this.el.content, t === 2 || t === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (i = it.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const f of i.getAttributeNames()) if (f.endsWith(Xs)) {
          const d = c[s++], p = i.getAttribute(f).split(Le), h = /([.?@])?(.*)/.exec(d);
          l.push({ type: 1, index: u, name: h[2], strings: p, ctor: h[1] === "." ? $a : h[1] === "?" ? Pa : h[1] === "@" ? za : yr }), i.removeAttribute(f);
        } else f.startsWith(Le) && (l.push({ type: 6, index: u }), i.removeAttribute(f));
        if (eo.test(i.tagName)) {
          const f = i.textContent.split(Le), d = f.length - 1;
          if (d > 0) {
            i.textContent = ir ? ir.emptyScript : "";
            for (let p = 0; p < d; p++) i.append(f[p], tn()), it.nextNode(), l.push({ type: 2, index: ++u });
            i.append(f[d], tn());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Qs) l.push({ type: 2, index: u });
      else {
        let f = -1;
        for (; (f = i.data.indexOf(Le, f + 1)) !== -1; ) l.push({ type: 7, index: u }), f += Le.length - 1;
      }
      u++;
    }
  }
  static createElement(e, t) {
    const r = pt.createElement("template");
    return r.innerHTML = e, r;
  }
}
function Nt(n, e, t = n, r) {
  if (e === Ot) return e;
  let i = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const u = nn(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== u && (i?._$AO?.(!1), u === void 0 ? i = void 0 : (i = new u(n), i._$AT(n, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = i : t._$Cl = i), i !== void 0 && (e = Nt(n, i._$AS(n, e.values), i, r)), e;
}
class Ba {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, i = (e?.creationScope ?? pt).importNode(t, !0);
    it.currentNode = i;
    let u = it.nextNode(), s = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let a;
        l.type === 2 ? a = new Nn(u, u.nextSibling, this, e) : l.type === 1 ? a = new l.ctor(u, l.name, l.strings, this, e) : l.type === 6 && (a = new La(u, this, e)), this._$AV.push(a), l = r[++o];
      }
      s !== l?.index && (u = it.nextNode(), s++);
    }
    return it.currentNode = pt, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class Nn {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = V, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = Nt(this, e, t), nn(e) ? e === V || e == null || e === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : e !== this._$AH && e !== Ot && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : va(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== V && nn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(pt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = rn.createElement(to(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const u = new Ba(i, this), s = u.u(this.options);
      u.p(t), this.T(s), this._$AH = u;
    }
  }
  _$AC(e) {
    let t = Su.get(e.strings);
    return t === void 0 && Su.set(e.strings, t = new rn(e)), t;
  }
  k(e) {
    Pi(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const u of e) i === t.length ? t.push(r = new Nn(this.O(tn()), this.O(tn()), this, this.options)) : r = t[i], r._$AI(u), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = bu(e).nextSibling;
      bu(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class yr {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, u) {
    this.type = 1, this._$AH = V, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = u, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = V;
  }
  _$AI(e, t = this, r, i) {
    const u = this.strings;
    let s = !1;
    if (u === void 0) e = Nt(this, e, t, 0), s = !nn(e) || e !== this._$AH && e !== Ot, s && (this._$AH = e);
    else {
      const o = e;
      let l, a;
      for (e = u[0], l = 0; l < u.length - 1; l++) a = Nt(this, o[r + l], t, l), a === Ot && (a = this._$AH[l]), s ||= !nn(a) || a !== this._$AH[l], a === V ? e = V : e !== V && (e += (a ?? "") + u[l + 1]), this._$AH[l] = a;
    }
    s && !i && this.j(e);
  }
  j(e) {
    e === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class $a extends yr {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === V ? void 0 : e;
  }
}
class Pa extends yr {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== V);
  }
}
class za extends yr {
  constructor(e, t, r, i, u) {
    super(e, t, r, i, u), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = Nt(this, e, t, 0) ?? V) === Ot) return;
    const r = this._$AH, i = e === V && r !== V || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, u = e !== V && (r === V || i);
    i && this.element.removeEventListener(this.name, this, r), u && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
let La = class {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Nt(this, e);
  }
};
const Va = $i.litHtmlPolyfillSupport;
Va?.(rn, Nn), ($i.litHtmlVersions ??= []).push("3.3.3");
const qa = (n, e, t) => {
  const r = t?.renderBefore ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const u = t?.renderBefore ?? null;
    r._$litPart$ = i = new Nn(e.insertBefore(tn(), u), u, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
const zi = globalThis;
let Kt = class extends Ct {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = qa(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Ot;
  }
};
Kt._$litElement$ = !0, Kt.finalized = !0, zi.litElementHydrateSupport?.({ LitElement: Kt });
const Ha = zi.litElementPolyfillSupport;
Ha?.({ LitElement: Kt });
(zi.litElementVersions ??= []).push("4.2.2");
function K(n) {
  this.content = n;
}
K.prototype = {
  constructor: K,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, i = r.find(n), u = r.content.slice();
    return i == -1 ? u.push(t || n, e) : (u[i + 1] = e, t && (u[i] = t)), new K(u);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new K(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new K([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new K(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), u = r.find(n);
    return i.splice(u == -1 ? i.length : u, 0, e, t), new K(i);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(n) {
    return n = K.from(n), n.size ? new K(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = K.from(n), n.size ? new K(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = K.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var n = {};
    return this.forEach(function(e, t) {
      n[e] = t;
    }), n;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
K.from = function(n) {
  if (n instanceof K) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new K(e);
};
function no(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r), u = e.child(r);
    if (i == u) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(u))
      return t;
    if (i.isText && i.text != u.text) {
      let s = i.text, o = u.text, l = 0;
      for (; s[l] == o[l]; l++)
        t++;
      return l && l < s.length && l < o.length && uo(s.charCodeAt(l - 1)) && io(s.charCodeAt(l)) && t--, t;
    }
    if (i.content.size || u.content.size) {
      let s = no(i.content, u.content, t + 1);
      if (s != null)
        return s;
    }
    t += i.nodeSize;
  }
}
function ro(n, e, t, r) {
  for (let i = n.childCount, u = e.childCount; ; ) {
    if (i == 0 || u == 0)
      return i == u ? null : { a: t, b: r };
    let s = n.child(--i), o = e.child(--u), l = s.nodeSize;
    if (s == o) {
      t -= l, r -= l;
      continue;
    }
    if (!s.sameMarkup(o))
      return { a: t, b: r };
    if (s.isText && s.text != o.text) {
      let a = s.text, c = o.text, f = a.length, d = c.length;
      for (; f > 0 && d > 0 && a[f - 1] == c[d - 1]; )
        f--, d--, t--, r--;
      return f && d && f < a.length && uo(a.charCodeAt(f - 1)) && io(a.charCodeAt(f)) && (t++, r++), { a: t, b: r };
    }
    if (s.content.size || o.content.size) {
      let a = ro(s.content, o.content, t - 1, r - 1);
      if (a)
        return a;
    }
    t -= l, r -= l;
  }
}
function io(n) {
  return n >= 56320 && n < 57344;
}
function uo(n) {
  return n >= 55296 && n < 56320;
}
class k {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, r, i = 0, u) {
    for (let s = 0, o = 0; o < t; s++) {
      let l = this.content[s], a = o + l.nodeSize;
      if (a > e && r(l, i + o, u || null, s) !== !1 && l.content.size) {
        let c = o + 1;
        l.nodesBetween(Math.max(0, e - c), Math.min(l.content.size, t - c), r, i + c);
      }
      o = a;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, r, i) {
    let u = "", s = !0;
    return this.nodesBetween(e, t, (o, l) => {
      let a = o.isText ? o.text.slice(Math.max(e, l) - l, t - l) : o.isLeaf ? i ? typeof i == "function" ? i(o) : i : o.type.spec.leafText ? o.type.spec.leafText(o) : "" : "";
      o.isBlock && (o.isLeaf && a || o.isTextblock) && r && (s ? s = !1 : u += r), u += a;
    }, 0), u;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, i = this.content.slice(), u = 0;
    for (t.isText && t.sameMarkup(r) && (i[i.length - 1] = t.withText(t.text + r.text), u = 1); u < e.content.length; u++)
      i.push(e.content[u]);
    return new k(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], i = 0;
    if (t > e)
      for (let u = 0, s = 0; s < t; u++) {
        let o = this.content[u], l = s + o.nodeSize;
        l > e && ((s < e || l > t) && (o.isText ? o = o.cut(Math.max(0, e - s), Math.min(o.text.length, t - s)) : o = o.cut(Math.max(0, e - s - 1), Math.min(o.content.size, t - s - 1))), r.push(o), i += o.nodeSize), s = l;
      }
    return new k(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? k.empty : e == 0 && t == this.content.length ? this : new k(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let i = this.content.slice(), u = this.size + t.nodeSize - r.nodeSize;
    return i[e] = t, new k(i, u);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new k([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new k(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, r, t), r += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return no(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return ro(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Ln(0, e);
    if (e == this.size)
      return Ln(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), u = r + i.nodeSize;
      if (u >= e)
        return u == e ? Ln(t + 1, u) : Ln(t, r);
      r = u;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return k.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return k.fromArray(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return k.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let u = e[i];
      r += u.nodeSize, i && u.isText && e[i - 1].sameMarkup(u) ? (t || (t = e.slice(0, i)), t[t.length - 1] = u.withText(t[t.length - 1].text + u.text)) : t && t.push(u);
    }
    return new k(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return k.empty;
    if (e instanceof k)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new k([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
k.empty = new k([], 0);
const Br = { index: 0, offset: 0 };
function Ln(n, e) {
  return Br.index = n, Br.offset = e, Br;
}
function ur(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!ur(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !ur(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
class N {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, r = !1;
    for (let i = 0; i < e.length; i++) {
      let u = e[i];
      if (this.eq(u))
        return e;
      if (this.type.excludes(u.type))
        t || (t = e.slice(0, i));
      else {
        if (u.type.excludes(this.type))
          return e;
        !r && u.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), r = !0), t && t.push(u);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && ur(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let i = r.create(t.attrs);
    return r.checkAttrs(i.attrs), i;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return N.none;
    if (e instanceof N)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
}
N.none = [];
class un extends Error {
}
class E {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let r = oo(this.content, e + this.openStart, t, this.openStart + 1, this.openEnd + 1);
    return r && new E(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new E(so(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return E.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new E(k.fromJSON(e, t.content), r, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, i = 0;
    for (let u = e.firstChild; u && !u.isLeaf && (t || !u.type.spec.isolating); u = u.firstChild)
      r++;
    for (let u = e.lastChild; u && !u.isLeaf && (t || !u.type.spec.isolating); u = u.lastChild)
      i++;
    return new E(e, r, i);
  }
}
E.empty = new E(k.empty, 0, 0);
function so(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), u = n.maybeChild(r), { index: s, offset: o } = n.findIndex(t);
  if (i == e || u.isText) {
    if (o != t && !n.child(s).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != s)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, u.copy(so(u.content, e - i - 1, t - i - 1)));
}
function oo(n, e, t, r, i, u) {
  let { index: s, offset: o } = n.findIndex(e), l = n.maybeChild(s);
  if (o == e || l.isText)
    return u && r <= 0 && i <= 0 && !u.canReplace(s, s, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = oo(l.content, e - o - 1, t, s == 0 ? r - 1 : 0, s == n.childCount - 1 ? i - 1 : 0, l);
  return a && n.replaceChild(s, l.copy(a));
}
function Ua(n, e, t) {
  if (t.openStart > n.depth)
    throw new un("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new un("Inconsistent open depths");
  return lo(n, e, t, 0);
}
function lo(n, e, t, r) {
  let i = n.index(r), u = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let s = lo(n, e, t, r + 1);
    return u.copy(u.content.replaceChild(i, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let s = n.parent, o = s.content;
      return ct(s, o.cut(0, n.parentOffset).append(t.content).append(o.cut(e.parentOffset)));
    } else {
      let { start: s, end: o } = Wa(t, n);
      return ct(u, co(n, s, o, e, r));
    }
  else return ct(u, sr(n, e, r));
}
function ao(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new un("Cannot join " + e.type.name + " onto " + n.type.name);
}
function ci(n, e, t) {
  let r = n.node(t);
  return ao(r, e.node(t)), r;
}
function at(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Zt(n, e, t, r) {
  let i = (e || n).node(t), u = 0, s = e ? e.index(t) : i.childCount;
  n && (u = n.index(t), n.depth > t ? u++ : n.textOffset && (at(n.nodeAfter, r), u++));
  for (let o = u; o < s; o++)
    at(i.child(o), r);
  e && e.depth == t && e.textOffset && at(e.nodeBefore, r);
}
function ct(n, e) {
  if (!n.type.validContent(e))
    throw new un("Invalid content for node " + n.type.name);
  return n.copy(e);
}
function co(n, e, t, r, i) {
  let u = n.depth > i && ci(n, e, i + 1), s = r.depth > i && ci(t, r, i + 1), o = [];
  return Zt(null, n, i, o), u && s && e.index(i) == t.index(i) ? (ao(u, s), at(ct(u, co(n, e, t, r, i + 1)), o)) : (u && at(ct(u, sr(n, e, i + 1)), o), Zt(e, t, i, o), s && at(ct(s, sr(t, r, i + 1)), o)), Zt(r, null, i, o), new k(o);
}
function sr(n, e, t) {
  let r = [];
  if (Zt(null, n, t, r), n.depth > t) {
    let i = ci(n, e, t + 1);
    at(ct(i, sr(n, e, t + 1)), r);
  }
  return Zt(e, null, t, r), new k(r);
}
function Wa(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let u = t - 1; u >= 0; u--)
    i = e.node(u).copy(k.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class sn {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return r ? e.child(t).cut(r) : i;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let u = 0; u < e; u++)
      i += r.child(u).nodeSize;
    return i;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return N.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!r) {
      let o = r;
      r = i, i = o;
    }
    let u = r.marks;
    for (var s = 0; s < u.length; s++)
      u[s].type.spec.inclusive === !1 && (!i || !u[s].isInSet(i.marks)) && (u = u[s--].removeFromSet(u));
    return u;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, i = e.parent.maybeChild(e.index());
    for (var u = 0; u < r.length; u++)
      r[u].type.spec.inclusive === !1 && (!i || !r[u].isInSet(i.marks)) && (r = r[u--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new Ka(this, e, r);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], i = 0, u = t;
    for (let s = e; ; ) {
      let { index: o, offset: l } = s.content.findIndex(u), a = u - l;
      if (r.push(s, o, i + l), !a || (s = s.child(o), s.isText))
        break;
      u = a - 1, i += l + 1;
    }
    return new sn(t, r, u);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Eu.get(e);
    if (r)
      for (let u = 0; u < r.elts.length; u++) {
        let s = r.elts[u];
        if (s.pos == t)
          return s;
      }
    else
      Eu.set(e, r = new ja());
    let i = r.elts[r.i] = sn.resolve(e, t);
    return r.i = (r.i + 1) % Ja, i;
  }
}
class ja {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const Ja = 12, Eu = /* @__PURE__ */ new WeakMap();
class Ka {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const Za = /* @__PURE__ */ Object.create(null);
class Ee {
  /**
  @internal
  */
  constructor(e, t, r, i = N.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || k.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively overlapping
  the given two positions that are relative to start of this
  node's content. This includes all ancestors of the nodes
  containing the two positions. The callback is invoked with the
  node, its position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, r) {
    return this.type == e && ur(this.attrs, t || e.defaultAttrs || Za) && N.sameSet(this.marks, r || N.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Ee(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Ee(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return E.empty;
    let i = this.resolve(e), u = this.resolve(t), s = r ? 0 : i.sharedDepth(t), o = i.start(s), a = i.node(s).content.cut(i.pos - o, u.pos - o);
    return new E(a, i.depth - s, u.depth - s);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, r) {
    return Ua(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return sn.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return sn.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (u) => (r.isInSet(u.marks) && (i = !0), !i)), i;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), fo(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, r = k.empty, i = 0, u = r.childCount) {
    let s = this.contentMatchAt(e).matchFragment(r, i, u), o = s && s.matchFragment(this.content, t);
    if (!o || !o.validEnd)
      return !1;
    for (let l = i; l < u; l++)
      if (!this.type.allowsMarks(r.child(l).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let u = this.contentMatchAt(e).matchType(r), s = u && u.matchFragment(this.content, t);
    return s ? s.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = N.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!N.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let i = k.fromJSON(e, t.content), u = e.nodeType(t.type).create(t.attrs, i, r);
    return u.type.checkAttrs(u.attrs), u;
  }
}
Ee.prototype.text = void 0;
class or extends Ee {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : fo(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new or(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new or(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function fo(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class mt {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let r = new Ga(e, t);
    if (r.next == null)
      return mt.empty;
    let i = ho(r);
    r.next && r.err("Unexpected trailing text");
    let u = rc(nc(i));
    return ic(u, r), u;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, r = e.childCount) {
    let i = this;
    for (let u = t; i && u < r; u++)
      i = i.matchType(e.child(u).type);
    return i;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, r = 0) {
    let i = [this];
    function u(s, o) {
      let l = s.matchFragment(e, r);
      if (l && (!t || l.validEnd))
        return k.from(o.map((a) => a.createAndFill()));
      for (let a = 0; a < s.next.length; a++) {
        let { type: c, next: f } = s.next[a];
        if (!(c.isText || c.hasRequiredAttrs()) && i.indexOf(f) == -1) {
          i.push(f);
          let d = u(f, o.concat(c));
          if (d)
            return d;
        }
      }
      return null;
    }
    return u(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let i = r.shift(), u = i.match;
      if (u.matchType(e)) {
        let s = [];
        for (let o = i; o.type; o = o.via)
          s.push(o.type);
        return s.reverse();
      }
      for (let s = 0; s < u.next.length; s++) {
        let { type: o, next: l } = u.next[s];
        !o.isLeaf && !o.hasRequiredAttrs() && !(o.name in t) && (!i.type || l.validEnd) && (r.push({ match: o.contentMatch, type: o, via: i }), t[o.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return t(this), e.map((r, i) => {
      let u = i + (r.validEnd ? "*" : " ") + " ";
      for (let s = 0; s < r.next.length; s++)
        u += (s ? ", " : "") + r.next[s].type.name + "->" + e.indexOf(r.next[s].next);
      return u;
    }).join(`
`);
  }
}
mt.empty = new mt(!0);
class Ga {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function ho(n) {
  let e = [];
  do
    e.push(Ya(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Ya(n) {
  let e = [];
  do
    e.push(Xa(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Xa(n) {
  let e = tc(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = Qa(n, e);
    else
      break;
  return e;
}
function _u(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function Qa(n, e) {
  let t = _u(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = _u(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function ec(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let i = [];
  for (let u in t) {
    let s = t[u];
    s.isInGroup(e) && i.push(s);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function tc(n) {
  if (n.eat("(")) {
    let e = ho(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = ec(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function nc(n) {
  let e = [[]];
  return i(u(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(s, o, l) {
    let a = { term: l, to: o };
    return e[s].push(a), a;
  }
  function i(s, o) {
    s.forEach((l) => l.to = o);
  }
  function u(s, o) {
    if (s.type == "choice")
      return s.exprs.reduce((l, a) => l.concat(u(a, o)), []);
    if (s.type == "seq")
      for (let l = 0; ; l++) {
        let a = u(s.exprs[l], o);
        if (l == s.exprs.length - 1)
          return a;
        i(a, o = t());
      }
    else if (s.type == "star") {
      let l = t();
      return r(o, l), i(u(s.expr, l), l), [r(l)];
    } else if (s.type == "plus") {
      let l = t();
      return i(u(s.expr, o), l), i(u(s.expr, l), l), [r(l)];
    } else {
      if (s.type == "opt")
        return [r(o)].concat(u(s.expr, o));
      if (s.type == "range") {
        let l = o;
        for (let a = 0; a < s.min; a++) {
          let c = t();
          i(u(s.expr, l), c), l = c;
        }
        if (s.max == -1)
          i(u(s.expr, l), l);
        else
          for (let a = s.min; a < s.max; a++) {
            let c = t();
            r(l, c), i(u(s.expr, l), c), l = c;
          }
        return [r(l)];
      } else {
        if (s.type == "name")
          return [r(o, void 0, s.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function po(n, e) {
  return e - n;
}
function wu(n, e) {
  let t = [];
  return r(e), t.sort(po);
  function r(i) {
    let u = n[i];
    if (u.length == 1 && !u[0].term)
      return r(u[0].to);
    t.push(i);
    for (let s = 0; s < u.length; s++) {
      let { term: o, to: l } = u[s];
      !o && t.indexOf(l) == -1 && r(l);
    }
  }
}
function rc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(wu(n, 0));
  function t(r) {
    let i = [];
    r.forEach((s) => {
      n[s].forEach(({ term: o, to: l }) => {
        if (!o)
          return;
        let a;
        for (let c = 0; c < i.length; c++)
          i[c][0] == o && (a = i[c][1]);
        wu(n, l).forEach((c) => {
          a || i.push([o, a = []]), a.indexOf(c) == -1 && a.push(c);
        });
      });
    });
    let u = e[r.join(",")] = new mt(r.indexOf(n.length - 1) > -1);
    for (let s = 0; s < i.length; s++) {
      let o = i[s][1].sort(po);
      u.next.push({ type: i[s][0], next: e[o.join(",")] || t(o) });
    }
    return u;
  }
}
function ic(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], u = !i.validEnd, s = [];
    for (let o = 0; o < i.next.length; o++) {
      let { type: l, next: a } = i.next[o];
      s.push(l.name), u && !(l.isText || l.hasRequiredAttrs()) && (u = !1), r.indexOf(a) == -1 && r.push(a);
    }
    u && e.err("Only non-generatable nodes (" + s.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function mo(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function go(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let u = n[r];
      if (u.hasDefault)
        i = u.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function bo(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${r}`);
  for (let i in n)
    n[i].validate && n[i].validate(e[i]);
}
function xo(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new sc(n, r, e[r]);
  return t;
}
let Au = class yo {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = xo(e, r.attrs), this.defaultAttrs = mo(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == mt.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  Return true when this node type is part of the given
  [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
  */
  isInGroup(e) {
    return this.groups.indexOf(e) > -1;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : go(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new Ee(this, this.computeAttrs(e), k.from(t), N.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = k.from(t), this.checkContent(t), new Ee(this, this.computeAttrs(e), t, N.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = k.from(t), t.size) {
      let s = this.contentMatch.fillBefore(t);
      if (!s)
        return null;
      t = s.append(t);
    }
    let i = this.contentMatch.matchFragment(t), u = i && i.fillBefore(k.empty, !0);
    return u ? new Ee(this, e, t.append(u), N.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  @internal
  */
  checkAttrs(e) {
    bo(this.attrs, e, "node", this.name);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : N.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((u, s) => r[u] = new yo(u, t, s));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let u in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
function uc(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let u = i === null ? "null" : typeof i;
    if (r.indexOf(u) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${u}`);
  };
}
class sc {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? uc(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class kr {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = xo(e, i.attrs), this.excluded = null;
    let u = mo(this.attrs);
    this.instance = u ? new N(this, u) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new N(this, go(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((u, s) => r[u] = new kr(u, i++, t, s)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  @internal
  */
  checkAttrs(e) {
    bo(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class ko {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = K.from(e.nodes), t.marks = K.from(e.marks || {}), this.nodes = Au.compile(this.spec.nodes, this), this.marks = kr.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let u = this.nodes[i], s = u.spec.content || "", o = u.spec.marks;
      if (u.contentMatch = r[s] || (r[s] = mt.parse(s, this.nodes)), u.inlineContent = u.contentMatch.inlineContent, u.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!u.isInline || !u.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = u;
      }
      u.markSet = o == "_" ? null : o ? Mu(this, o.split(" ")) : o == "" || !u.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let u = this.marks[i], s = u.spec.excludes;
      u.excluded = s == null ? [u] : s == "" ? [] : Mu(this, s.split(" "));
    }
    this.nodeFromJSON = (i) => Ee.fromJSON(this, i), this.markFromJSON = (i) => N.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Au) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new or(r, r.defaultAttrs, e, N.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Mu(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], u = n.marks[i], s = u;
    if (u)
      t.push(u);
    else
      for (let o in n.marks) {
        let l = n.marks[o];
        (i == "_" || l.spec.group && l.spec.group.split(" ").indexOf(i) > -1) && t.push(s = l);
      }
    if (!s)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function oc(n) {
  return n.tag != null;
}
function lc(n) {
  return n.style != null;
}
class on {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (oc(i))
        this.tags.push(i);
      else if (lc(i)) {
        let u = /[^=]*/.exec(i.style)[0];
        r.indexOf(u) < 0 && r.push(u), this.styles.push(i);
      }
    }), this.normalizeLists = !this.tags.some((i) => {
      if (!/^(ul|ol)\b/.test(i.tag) || !i.node)
        return !1;
      let u = e.nodes[i.node];
      return u.contentMatch.matchType(u);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Ou(this, t, !1);
    return r.addAll(e, N.none, t.from, t.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let r = new Ou(this, t, !0);
    return r.addAll(e, N.none, t.from, t.to), E.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let u = this.tags[i];
      if (fc(e, u.tag) && (u.namespace === void 0 || e.namespaceURI == u.namespace) && (!u.context || t.matchesContext(u.context))) {
        if (u.getAttrs) {
          let s = u.getAttrs(e);
          if (s === !1)
            continue;
          u.attrs = s || void 0;
        }
        return u;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, i) {
    for (let u = i ? this.styles.indexOf(i) + 1 : 0; u < this.styles.length; u++) {
      let s = this.styles[u], o = s.style;
      if (!(o.indexOf(e) != 0 || s.context && !r.matchesContext(s.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      o.length > e.length && (o.charCodeAt(e.length) != 61 || o.slice(e.length + 1) != t))) {
        if (s.getAttrs) {
          let l = s.getAttrs(t);
          if (l === !1)
            continue;
          s.attrs = l || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function r(i) {
      let u = i.priority == null ? 50 : i.priority, s = 0;
      for (; s < t.length; s++) {
        let o = t[s];
        if ((o.priority == null ? 50 : o.priority) < u)
          break;
      }
      t.splice(s, 0, i);
    }
    for (let i in e.marks) {
      let u = e.marks[i].spec.parseDOM;
      u && u.forEach((s) => {
        r(s = Nu(s)), s.mark || s.ignore || s.clearMark || (s.mark = i);
      });
    }
    for (let i in e.nodes) {
      let u = e.nodes[i].spec.parseDOM;
      u && u.forEach((s) => {
        r(s = Nu(s)), s.node || s.ignore || s.mark || (s.node = i);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.GenericParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new on(e, on.schemaRules(e)));
  }
}
const Co = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  body: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, ac = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Do = { ol: !0, ul: !0 }, ln = 1, fi = 2, Gt = 4;
function Tu(n, e, t) {
  return e != null ? (e ? ln : 0) | (e === "full" ? fi : 0) : n && n.whitespace == "pre" ? ln | fi : t & ~Gt;
}
class Vn {
  constructor(e, t, r, i, u, s) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = s, this.content = [], this.activeMarks = N.none, this.match = u || (s & Gt ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(k.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & ln)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let u = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = u.withText(u.text.slice(0, u.text.length - i[0].length));
      }
    }
    let t = k.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(k.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Co.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Ou {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, u, s = Tu(null, t.preserveWhitespace, 0) | (r ? Gt : 0);
    i ? u = new Vn(i.type, i.attrs, N.none, !0, t.topMatch || i.type.contentMatch, s) : r ? u = new Vn(null, null, N.none, !0, null, s) : u = new Vn(e.schema.topNodeType, null, N.none, !0, null, s), this.nodes = [u], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e, t) {
    e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
  }
  addTextNode(e, t) {
    let r = e.nodeValue, i = this.top, u = i.options & fi ? "full" : this.localPreserveWS || (i.options & ln) > 0, { schema: s } = this.parser;
    if (u === "full" || i.inlineContext(e) || /[^ \t\r\n\u000c]/.test(r)) {
      if (u)
        if (u === "full")
          r = r.replace(/\r\n?/g, `
`);
        else if (s.linebreakReplacement && /[\r\n]/.test(r) && this.top.findWrapping(s.linebreakReplacement.create())) {
          let o = r.split(/\r?\n|\r/);
          for (let l = 0; l < o.length; l++)
            l && this.insertNode(s.linebreakReplacement.create(), t, !0), o[l] && this.insertNode(s.text(o[l]), t, !/\S/.test(o[l]));
          r = "";
        } else
          r = r.replace(/\r?\n|\r/g, " ");
      else if (r = r.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(r) && this.open == this.nodes.length - 1) {
        let o = i.content[i.content.length - 1], l = e.previousSibling;
        (!o || l && l.nodeName == "BR" || o.isText && /[ \t\r\n\u000c]$/.test(o.text)) && (r = r.slice(1));
      }
      r && this.insertNode(s.text(r), t, !/\S/.test(r)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, r) {
    let i = this.localPreserveWS, u = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let s = e.nodeName.toLowerCase(), o;
    Do.hasOwnProperty(s) && this.parser.normalizeLists && cc(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : ac.hasOwnProperty(s))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let a, c = this.needsBlock;
      if (Co.hasOwnProperty(s))
        u.content.length && u.content[0].isInline && this.open && (this.open--, u = this.top), a = !0, u.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let f = l && l.skip ? t : this.readStyles(e, t);
      f && this.addAll(e, f), a && this.sync(u), this.needsBlock = c;
    } else {
      let a = this.readStyles(e, t);
      a && this.addElementByRule(e, l, a, l.consuming === !1 ? o : void 0);
    }
    this.localPreserveWS = i;
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e, t) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`), t);
  }
  // Called for ignored nodes
  ignoreFallback(e, t) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
  }
  // Run any style parser associated with the node's styles. Either
  // return an updated array of marks, or null to indicate some of the
  // styles had a rule with `ignore` set.
  readStyles(e, t) {
    let r = e.style;
    if (r && r.length)
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let u = this.parser.matchedStyles[i], s = r.getPropertyValue(u);
        if (s)
          for (let o = void 0; ; ) {
            let l = this.parser.matchStyle(u, s, this, o);
            if (!l)
              break;
            if (l.ignore)
              return null;
            if (l.clearMark ? t = t.filter((a) => !l.clearMark(a)) : t = t.concat(this.parser.schema.marks[l.mark].create(l.attrs)), l.consuming === !1)
              o = l;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, r, i) {
    let u, s;
    if (t.node)
      if (s = this.parser.schema.nodes[t.node], s.isLeaf)
        this.insertNode(s.create(t.attrs), r, e.nodeName == "BR") || this.leafFallback(e, r);
      else {
        let l = this.enter(s, t.attrs || null, r, t.preserveWhitespace);
        l && (u = !0, r = l);
      }
    else {
      let l = this.parser.schema.marks[t.mark];
      r = r.concat(l.create(t.attrs));
    }
    let o = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (i)
      this.addElement(e, r, i);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l, r, !1));
    else {
      let l = e;
      typeof t.contentElement == "string" ? l = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? l = t.contentElement(e) : t.contentElement && (l = t.contentElement), this.findAround(e, l, !0), this.addAll(l, r), this.findAround(e, l, !1);
    }
    u && this.sync(o) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r, i) {
    let u = r || 0;
    for (let s = r ? e.childNodes[r] : e.firstChild, o = i == null ? null : e.childNodes[i]; s != o; s = s.nextSibling, ++u)
      this.findAtPoint(e, u), this.addDOM(s, t);
    this.findAtPoint(e, u);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, r) {
    let i, u;
    for (let s = this.open, o = 0; s >= 0; s--) {
      let l = this.nodes[s], a = l.findWrapping(e);
      if (a && (!i || i.length > a.length + o) && (i = a, u = l, !a.length))
        break;
      if (l.solid) {
        if (r)
          break;
        o += 2;
      }
    }
    if (!i)
      return null;
    this.sync(u);
    for (let s = 0; s < i.length; s++)
      t = this.enterInner(i[s], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, r) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let u = this.textblockFromContext();
      u && (t = this.enterInner(u, null, t));
    }
    let i = this.findPlace(e, t, r);
    if (i) {
      this.closeExtra();
      let u = this.top;
      u.match && (u.match = u.match.matchType(e.type));
      let s = N.none;
      for (let o of i.concat(e.marks))
        (u.type ? u.type.allowsMarkType(o.type) : Fu(o.type, e.type)) && (s = o.addToSet(s));
      return u.content.push(e.mark(s)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r, i) {
    let u = this.findPlace(e.create(t), r, !1);
    return u && (u = this.enterInner(e, t, r, !0, i)), u;
  }
  // Open a node of the given type
  enterInner(e, t, r, i = !1, u) {
    this.closeExtra();
    let s = this.top;
    s.match = s.match && s.match.matchType(e);
    let o = Tu(e, u, s.options);
    s.options & Gt && s.content.length == 0 && (o |= Gt);
    let l = N.none;
    return r = r.filter((a) => (s.type ? s.type.allowsMarkType(a.type) : Fu(a.type, e)) ? (l = a.addToSet(l), !1) : !0), this.nodes.push(new Vn(e, t, l, i, null, o)), this.open++, r;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) {
      if (this.nodes[t] == e)
        return this.open = t, !0;
      this.localPreserveWS && (this.nodes[t].options |= ln);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), u = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), s = (o, l) => {
      for (; o >= 0; o--) {
        let a = t[o];
        if (a == "") {
          if (o == t.length - 1 || o == 0)
            continue;
          for (; l >= u; l--)
            if (s(o - 1, l))
              return !0;
          return !1;
        } else {
          let c = l > 0 || l == 0 && i ? this.nodes[l].type : r && l >= u ? r.node(l - u).type : null;
          if (!c || c.name != a && !c.isInGroup(a))
            return !1;
          l--;
        }
      }
      return !0;
    };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
}
function cc(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Do.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function fc(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Nu(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Fu(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let u = [], s = (o) => {
      u.push(o);
      for (let l = 0; l < o.edgeCount; l++) {
        let { type: a, next: c } = o.edge(l);
        if (a == e || u.indexOf(c) < 0 && s(c))
          return !0;
      }
    };
    if (s(i.contentMatch))
      return !0;
  }
}
class Pt {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, t = {}, r) {
    r || (r = qn(t).createDocumentFragment());
    let i = r, u = [];
    return e.forEach((s) => {
      if (u.length || s.marks.length) {
        let o = 0, l = 0;
        for (; o < u.length && l < s.marks.length; ) {
          let a = s.marks[l];
          if (!this.marks[a.type.name]) {
            l++;
            continue;
          }
          if (!a.eq(u[o][0]) || a.type.spec.spanning === !1)
            break;
          o++, l++;
        }
        for (; o < u.length; )
          i = u.pop()[1];
        for (; l < s.marks.length; ) {
          let a = s.marks[l++], c = this.serializeMark(a, s.isInline, t);
          c && (u.push([a, i]), i.appendChild(c.dom), i = c.contentDOM || c.dom);
        }
      }
      i.appendChild(this.serializeNodeInner(s, t));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, t) {
    if (e.isText)
      return qn(t).createTextNode(e.text);
    let { dom: r, contentDOM: i } = Gn(qn(t), this.nodes[e.type.name](e), null, e.attrs);
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, i);
    }
    return r;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let u = this.serializeMark(e.marks[i], e.isInline, t);
      u && ((u.contentDOM || u.dom).appendChild(r), r = u.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, t, r = {}) {
    let i = this.marks[e.type.name];
    return i && Gn(qn(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return typeof t == "string" ? { dom: e.createTextNode(t) } : Gn(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Pt(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = vu(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return vu(e.marks);
  }
}
function vu(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function qn(n) {
  return n.document || window.document;
}
const Iu = /* @__PURE__ */ new WeakMap();
function hc(n) {
  let e = Iu.get(n);
  return e === void 0 && Iu.set(n, e = dc(n)), e;
}
function dc(n) {
  let e = null;
  function t(r) {
    if (r && typeof r == "object")
      if (Array.isArray(r))
        if (typeof r[0] == "string")
          e || (e = []), e.push(r);
        else
          for (let i = 0; i < r.length; i++)
            t(r[i]);
      else
        for (let i in r)
          t(r[i]);
  }
  return t(n), e;
}
function Gn(n, e, t, r) {
  if (e.nodeType == 1)
    return { dom: e };
  if (e.dom && e.dom.nodeType == 1)
    return e;
  let i = e[0], u;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (u = hc(r)) && u.indexOf(e) > -1)
    throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
  let s = i.indexOf(" ");
  s > 0 && (t = i.slice(0, s), i = i.slice(s + 1));
  let o, l = t ? n.createElementNS(t, i) : n.createElement(i), a = e[1], c = 1;
  if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
    c = 2;
    for (let f in a)
      if (a[f] != null) {
        let d = f.indexOf(" ");
        d > 0 ? l.setAttributeNS(f.slice(0, d), f.slice(d + 1), a[f]) : f == "style" && l.style ? l.style.cssText = a[f] : l.setAttribute(f, a[f]);
      }
  }
  for (let f = c; f < e.length; f++) {
    let d = e[f];
    if (d === 0) {
      if (f < e.length - 1 || f > c)
        throw new RangeError("Content hole must be the only child of its parent node");
      return { dom: l, contentDOM: l };
    } else if (typeof d == "string")
      l.appendChild(n.createTextNode(d));
    else {
      let { dom: p, contentDOM: h } = Gn(n, d, t, r);
      if (l.appendChild(p), h) {
        if (o)
          throw new RangeError("Multiple content holes");
        o = h;
      }
    }
  }
  return { dom: l, contentDOM: o };
}
const So = 65535, Eo = Math.pow(2, 16);
function pc(n, e) {
  return n + e * Eo;
}
function Ru(n) {
  return n & So;
}
function mc(n) {
  return (n - (n & So)) / Eo;
}
const _o = 1, wo = 2, Yn = 4, Ao = 8;
class hi {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Ao) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (_o | Yn)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (wo | Yn)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Yn) > 0;
  }
}
class ue {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && ue.empty)
      return ue.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Ru(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + mc(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let i = 0, u = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let o = 0; o < this.ranges.length; o += 3) {
      let l = this.ranges[o] - (this.inverted ? i : 0);
      if (l > e)
        break;
      let a = this.ranges[o + u], c = this.ranges[o + s], f = l + a;
      if (e <= f) {
        let d = a ? e == l ? -1 : e == f ? 1 : t : t, p = l + i + (d < 0 ? 0 : c);
        if (r)
          return p;
        let h = e == (t < 0 ? l : f) ? null : pc(o / 3, e - l), m = e == l ? wo : e == f ? _o : Yn;
        return (t < 0 ? e != l : e != f) && (m |= Ao), new hi(p, m, h);
      }
      i += c - a;
    }
    return r ? e + i : new hi(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = Ru(t), u = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let o = 0; o < this.ranges.length; o += 3) {
      let l = this.ranges[o] - (this.inverted ? r : 0);
      if (l > e)
        break;
      let a = this.ranges[o + u], c = l + a;
      if (e <= c && o == i * 3)
        return !0;
      r += this.ranges[o + s] - a;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let i = 0, u = 0; i < this.ranges.length; i += 3) {
      let s = this.ranges[i], o = s - (this.inverted ? u : 0), l = s + (this.inverted ? 0 : u), a = this.ranges[i + t], c = this.ranges[i + r];
      e(o, o + a, l, l + c), u += c - a;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new ue(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? ue.empty : new ue(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
ue.empty = new ue([]);
class an {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e, t, r = 0, i = e ? e.length : 0) {
    this.mirror = t, this.from = r, this.to = i, this._maps = e || [], this.ownData = !(e || t);
  }
  /**
  The step maps in this mapping.
  */
  get maps() {
    return this._maps;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, t = this.maps.length) {
    return new an(this._maps, this.mirror, e, t);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, t) {
    this.ownData || (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), this.ownData = !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let t = 0, r = this._maps.length; t < e._maps.length; t++) {
      let i = e.getMirror(t);
      this.appendMap(e._maps[t], i != null && i < t ? r + i : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this._maps.length + e._maps.length; t >= 0; t--) {
      let i = e.getMirror(t);
      this.appendMap(e._maps[t].invert(), i != null && i > t ? r - i - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new an();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this._maps[r].map(e, t);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let i = 0;
    for (let u = this.from; u < this.to; u++) {
      let s = this._maps[u], o = s.mapResult(e, t);
      if (o.recover != null) {
        let l = this.getMirror(u);
        if (l != null && l > u && l < this.to) {
          u = l, e = this._maps[l].recover(o.recover);
          continue;
        }
      }
      i |= o.delInfo, e = o.pos;
    }
    return r ? e : new hi(e, i, null);
  }
}
const $r = /* @__PURE__ */ Object.create(null);
class Q {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return ue.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = $r[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in $r)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return $r[e] = t, t.prototype.jsonID = e, t;
  }
}
class q {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new q(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new q(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return q.ok(e.replace(t, r, i));
    } catch (u) {
      if (u instanceof un)
        return q.fail(u.message);
      throw u;
    }
  }
}
function Li(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let u = n.child(i);
    u.content.size && (u = u.copy(Li(u.content, e, u))), u.isInline && (u = e(u, t, i)), r.push(u);
  }
  return k.fromArray(r);
}
class Ue extends Q {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), u = new E(Li(t.content, (s, o) => !s.isAtom || !o.type.allowsMarkType(this.mark.type) ? s : s.mark(this.mark.addToSet(s.marks)), i), t.openStart, t.openEnd);
    return q.fromReplace(e, this.from, this.to, u);
  }
  invert() {
    return new Ce(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Ue(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ue && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Ue(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Ue(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Q.jsonID("addMark", Ue);
class Ce extends Q {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new E(Li(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return q.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Ue(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Ce(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ce && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Ce(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Ce(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Q.jsonID("removeMark", Ce);
class We extends Q {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return q.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return q.fromReplace(e, this.pos, this.pos + 1, new E(k.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new We(this.pos, t.marks[i]);
        return new We(this.pos, this.mark);
      }
    }
    return new gt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new We(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new We(t.pos, e.markFromJSON(t.mark));
  }
}
Q.jsonID("addNodeMark", We);
class gt extends Q {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return q.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return q.fromReplace(e, this.pos, this.pos + 1, new E(k.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new We(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new gt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new gt(t.pos, e.markFromJSON(t.mark));
  }
}
Q.jsonID("removeNodeMark", gt);
class U extends Q {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, i = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && di(e, this.from, this.to) ? q.fail("Structure replace would overwrite content") : q.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new ue([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new U(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), r = this.from == this.to && U.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return r.deletedAcross && t.deletedAcross ? null : new U(r.pos, Math.max(r.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof U) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? E.empty : new E(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new U(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? E.empty : new E(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new U(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new U(t.from, t.to, E.fromJSON(e, t.slice), !!t.structure);
  }
}
U.MAP_BIAS = 1;
Q.jsonID("replace", U);
class se extends Q {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, i, u, s, o = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = u, this.insert = s, this.structure = o;
  }
  apply(e) {
    if (this.structure && (di(e, this.from, this.gapFrom) || di(e, this.gapTo, this.to)))
      return q.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return q.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? q.fromReplace(e, this.from, this.to, r) : q.fail("Content does not fit in gap");
  }
  getMap() {
    return new ue([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new se(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), u = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || u > r.pos ? null : new se(t.pos, r.pos, i, u, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new se(t.from, t.to, t.gapFrom, t.gapTo, E.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
Q.jsonID("replaceAround", se);
function di(n, e, t) {
  let r = n.resolve(e), i = t - e, u = r.depth;
  for (; i > 0 && u > 0 && r.indexAfter(u) == r.node(u).childCount; )
    u--, i--;
  if (i > 0) {
    let s = r.node(u).maybeChild(r.indexAfter(u));
    for (; i > 0; ) {
      if (!s || s.isLeaf)
        return !0;
      s = s.firstChild, i--;
    }
  }
  return !1;
}
function gc(n, e, t, r) {
  let i = [], u = [], s, o;
  n.doc.nodesBetween(e, t, (l, a, c) => {
    if (!l.isInline)
      return;
    let f = l.marks;
    if (!r.isInSet(f) && c.type.allowsMarkType(r.type)) {
      let d = Math.max(a, e), p = Math.min(a + l.nodeSize, t), h = r.addToSet(f);
      for (let m = 0; m < f.length; m++)
        f[m].isInSet(h) || (s && s.to == d && s.mark.eq(f[m]) ? s.to = p : i.push(s = new Ce(d, p, f[m])));
      o && o.to == d ? o.to = p : u.push(o = new Ue(d, p, r));
    }
  }), i.forEach((l) => n.step(l)), u.forEach((l) => n.step(l));
}
function bc(n, e, t, r) {
  let i = [], u = 0;
  n.doc.nodesBetween(e, t, (s, o) => {
    if (!s.isInline)
      return;
    u++;
    let l = null;
    if (r instanceof kr) {
      let a = s.marks, c;
      for (; c = r.isInSet(a); )
        (l || (l = [])).push(c), a = c.removeFromSet(a);
    } else r ? r.isInSet(s.marks) && (l = [r]) : l = s.marks;
    if (l && l.length) {
      let a = Math.min(o + s.nodeSize, t);
      for (let c = 0; c < l.length; c++) {
        let f = l[c], d;
        for (let p = 0; p < i.length; p++) {
          let h = i[p];
          h.step == u - 1 && f.eq(i[p].style) && (d = h);
        }
        d ? (d.to = a, d.step = u) : i.push({ style: f, from: Math.max(o, e), to: a, step: u });
      }
    }
  }), i.forEach((s) => n.step(new Ce(s.from, s.to, s.style)));
}
function Vi(n, e, t, r = t.contentMatch, i = !0) {
  let u = n.doc.nodeAt(e), s = [], o = e + 1;
  for (let l = 0; l < u.childCount; l++) {
    let a = u.child(l), c = o + a.nodeSize, f = r.matchType(a.type);
    if (!f)
      s.push(new U(o, c, E.empty));
    else {
      r = f;
      for (let d = 0; d < a.marks.length; d++)
        t.allowsMarkType(a.marks[d].type) || n.step(new Ce(o, c, a.marks[d]));
      if (i && a.isText && t.whitespace != "pre") {
        let d, p = /\r?\n|\r/g, h;
        for (; d = p.exec(a.text); )
          h || (h = new E(k.from(t.schema.text(" ", t.allowedMarks(a.marks))), 0, 0)), s.push(new U(o + d.index, o + d.index + d[0].length, h));
      }
    }
    o = c;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(k.empty, !0);
    n.replace(o, o, new E(l, 0, 0));
  }
  for (let l = s.length - 1; l >= 0; l--)
    n.step(s[l]);
}
function xc(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function qi(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, u = 0; ; --r) {
    let s = n.$from.node(r), o = n.$from.index(r) + i, l = n.$to.indexAfter(r) - u;
    if (r < n.depth && s.canReplace(o, l, t))
      return r;
    if (r == 0 || s.type.spec.isolating || !xc(s, o, l))
      break;
    o && (i = 1), l < s.childCount && (u = 1);
  }
  return null;
}
function yc(n, e, t) {
  let { $from: r, $to: i, depth: u } = e, s = r.before(u + 1), o = i.after(u + 1), l = s, a = o, c = k.empty, f = 0;
  for (let h = u, m = !1; h > t; h--)
    m || r.index(h) > 0 ? (m = !0, c = k.from(r.node(h).copy(c)), f++) : l--;
  let d = k.empty, p = 0;
  for (let h = u, m = !1; h > t; h--)
    m || i.after(h + 1) < i.end(h) ? (m = !0, d = k.from(i.node(h).copy(d)), p++) : a++;
  n.step(new se(l, a, s, o, new E(c.append(d), f, p), c.size - f, !0));
}
function Mo(n, e, t = null, r = n) {
  let i = kc(n, e), u = i && Cc(r, e);
  return u ? i.map(Bu).concat({ type: e, attrs: t }).concat(u.map(Bu)) : null;
}
function Bu(n) {
  return { type: n, attrs: null };
}
function kc(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, u = t.contentMatchAt(r).findWrapping(e);
  if (!u)
    return null;
  let s = u.length ? u[0] : e;
  return t.canReplaceWith(r, i, s) ? u : null;
}
function Cc(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, u = t.child(r), s = e.contentMatch.findWrapping(u.type);
  if (!s)
    return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let a = r; l && a < i; a++)
    l = l.matchType(t.child(a).type);
  return !l || !l.validEnd ? null : s;
}
function Dc(n, e, t) {
  let r = k.empty;
  for (let s = t.length - 1; s >= 0; s--) {
    if (r.size) {
      let o = t[s].type.contentMatch.matchFragment(r);
      if (!o || !o.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = k.from(t[s].type.create(t[s].attrs, r));
  }
  let i = e.start, u = e.end;
  n.step(new se(i, u, i, u, new E(r, 0, 0), t.length, !0));
}
function Sc(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let u = n.steps.length;
  n.doc.nodesBetween(e, t, (s, o) => {
    let l = typeof i == "function" ? i(s) : i;
    if (s.isTextblock && !s.hasMarkup(r, l) && Ec(n.doc, n.mapping.slice(u).map(o), r)) {
      let a = null;
      if (r.schema.linebreakReplacement) {
        let p = r.whitespace == "pre", h = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        p && !h ? a = !1 : !p && h && (a = !0);
      }
      a === !1 && Oo(n, s, o, u), Vi(n, n.mapping.slice(u).map(o, 1), r, void 0, a === null);
      let c = n.mapping.slice(u), f = c.map(o, 1), d = c.map(o + s.nodeSize, 1);
      return n.step(new se(f, d, f + 1, d - 1, new E(k.from(r.create(l, null, s.marks)), 0, 0), 1, !0)), a === !0 && To(n, s, o, u), !1;
    }
  });
}
function To(n, e, t, r) {
  e.forEach((i, u) => {
    if (i.isText) {
      let s, o = /\r?\n|\r/g;
      for (; s = o.exec(i.text); ) {
        let l = n.mapping.slice(r).map(t + 1 + u + s.index);
        n.replaceWith(l, l + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Oo(n, e, t, r) {
  e.forEach((i, u) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let s = n.mapping.slice(r).map(t + 1 + u);
      n.replaceWith(s, s + 1, e.type.schema.text(`
`));
    }
  });
}
function Ec(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function _c(n, e, t, r, i) {
  let u = n.doc.nodeAt(e);
  if (!u)
    throw new RangeError("No node at given position");
  t || (t = u.type);
  let s = t.create(r, null, i || u.marks);
  if (u.isLeaf)
    return n.replaceWith(e, e + u.nodeSize, s);
  if (!t.validContent(u.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new se(e, e + u.nodeSize, e + 1, e + u.nodeSize - 1, new E(k.from(s), 0, 0), 1, !0));
}
function Xn(n, e, t = 1, r) {
  let i = n.resolve(e), u = i.depth - t, s = r && r[r.length - 1] || i.parent;
  if (u < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !s.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let a = i.depth - 1, c = t - 2; a > u; a--, c--) {
    let f = i.node(a), d = i.index(a);
    if (f.type.spec.isolating)
      return !1;
    let p = f.content.cutByIndex(d, f.childCount), h = r && r[c + 1];
    h && (p = p.replaceChild(0, h.type.create(h.attrs)));
    let m = r && r[c] || f;
    if (!f.canReplace(d + 1, f.childCount) || !m.type.validContent(p))
      return !1;
  }
  let o = i.indexAfter(u), l = r && r[0];
  return i.node(u).canReplaceWith(o, o, l ? l.type : i.node(u + 1).type);
}
function wc(n, e, t = 1, r) {
  let i = n.doc.resolve(e), u = k.empty, s = k.empty;
  for (let o = i.depth, l = i.depth - t, a = t - 1; o > l; o--, a--) {
    u = k.from(i.node(o).copy(u));
    let c = r && r[a];
    s = k.from(c ? c.type.create(c.attrs, s) : i.node(o).copy(s));
  }
  n.step(new U(e, e, new E(u.append(s), t, t), !0));
}
function Hi(n, e) {
  let t = n.resolve(e), r = t.index();
  return Mc(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Ac(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let u = e.child(i), s = u.type == r ? n.type.schema.nodes.text : u.type;
    if (t = t.matchType(s), !t || !n.type.allowsMarks(u.marks))
      return !1;
  }
  return t.validEnd;
}
function Mc(n, e) {
  return !!(n && e && !n.isLeaf && Ac(n, e));
}
function Tc(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, u = n.doc.resolve(e - t), s = u.node().type;
  if (i && s.inlineContent) {
    let c = s.whitespace == "pre", f = !!s.contentMatch.matchType(i);
    c && !f ? r = !1 : !c && f && (r = !0);
  }
  let o = n.steps.length;
  if (r === !1) {
    let c = n.doc.resolve(e + t);
    Oo(n, c.node(), c.before(), o);
  }
  s.inlineContent && Vi(n, e + t - 1, s, u.node().contentMatchAt(u.index()), r == null);
  let l = n.mapping.slice(o), a = l.map(e - t);
  if (n.step(new U(a, l.map(e + t, -1), E.empty, !0)), r === !0) {
    let c = n.doc.resolve(a);
    To(n, c.node(), c.before(), n.steps.length);
  }
  return n;
}
function Oc(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let u = r.index(i);
      if (r.node(i).canReplaceWith(u, u, t))
        return r.before(i + 1);
      if (u > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let u = r.indexAfter(i);
      if (r.node(i).canReplaceWith(u, u, t))
        return r.after(i + 1);
      if (u < r.node(i).childCount)
        return null;
    }
  return null;
}
function Nc(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let i = t.content;
  for (let u = 0; u < t.openStart; u++)
    i = i.firstChild.content;
  for (let u = 1; u <= (t.openStart == 0 && t.size ? 2 : 1); u++)
    for (let s = r.depth; s >= 0; s--) {
      let o = s == r.depth ? 0 : r.pos <= (r.start(s + 1) + r.end(s + 1)) / 2 ? -1 : 1, l = r.index(s) + (o > 0 ? 1 : 0), a = r.node(s), c = !1;
      if (u == 1)
        c = a.canReplace(l, l, i);
      else {
        let f = a.contentMatchAt(l).findWrapping(i.firstChild.type);
        c = f && a.canReplaceWith(l, l, f[0]);
      }
      if (c)
        return o == 0 ? r.pos : o < 0 ? r.before(s + 1) : r.after(s + 1);
    }
  return null;
}
function Ui(n, e, t = e, r = E.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), u = n.resolve(t);
  return No(i, u, r) ? new U(e, t, r) : new Fc(i, u, r).fit();
}
function No(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Fc {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = k.empty;
    for (let i = 0; i <= e.depth; i++) {
      let u = e.node(i);
      this.frontier.push({
        type: u.type,
        match: u.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = k.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let a = this.findFittable();
      a ? this.placeNodes(a) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let u = this.placed, s = r.depth, o = i.depth;
    for (; s && o && u.childCount == 1; )
      u = u.firstChild.content, s--, o--;
    let l = new E(u, s, o);
    return e > -1 ? new se(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new U(r.pos, i.pos, l) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, i = this.unplaced.openEnd; r < e; r++) {
      let u = t.firstChild;
      if (t.childCount > 1 && (i = 0), u.type.spec.isolating && i <= r) {
        e = r;
        break;
      }
      t = u.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let i, u = null;
        r ? (u = Pr(this.unplaced.content, r - 1).firstChild, i = u.content) : i = this.unplaced.content;
        let s = i.firstChild;
        for (let o = this.depth; o >= 0; o--) {
          let { type: l, match: a } = this.frontier[o], c, f = null;
          if (t == 1 && (s ? a.matchType(s.type) || (f = a.fillBefore(k.from(s), !1)) : u && l.compatibleContent(u.type)))
            return { sliceDepth: r, frontierDepth: o, parent: u, inject: f };
          if (t == 2 && s && (c = a.findWrapping(s.type)))
            return { sliceDepth: r, frontierDepth: o, parent: u, wrap: c };
          if (u && a.matchType(u.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Pr(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new E(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Pr(e, t);
    if (i.childCount <= 1 && t > 0) {
      let u = e.size - t <= t + i.size;
      this.unplaced = new E(Ht(e, t - 1, 1), t - 1, u ? t - 1 : r);
    } else
      this.unplaced = new E(Ht(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: i, wrap: u }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (u)
      for (let m = 0; m < u.length; m++)
        this.openFrontierNode(u[m]);
    let s = this.unplaced, o = r ? r.content : s.content, l = s.openStart - e, a = 0, c = [], { match: f, type: d } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        c.push(i.child(m));
      f = f.matchFragment(i);
    }
    let p = o.size + e - (s.content.size - s.openEnd);
    for (; a < o.childCount; ) {
      let m = o.child(a), g = f.matchType(m.type);
      if (!g)
        break;
      a++, (a > 1 || l == 0 || m.content.size) && (f = g, c.push(Fo(m.mark(d.allowedMarks(m.marks)), a == 1 ? l : 0, a == o.childCount ? p : -1)));
    }
    let h = a == o.childCount;
    h || (p = -1), this.placed = Ut(this.placed, t, k.from(c)), this.frontier[t].match = f, h && p < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = o; m < p; m++) {
      let b = g.lastChild;
      this.frontier.push({ type: b.type, match: b.contentMatchAt(b.childCount) }), g = b.content;
    }
    this.unplaced = h ? e == 0 ? E.empty : new E(Ht(s.content, e - 1, 1), e - 1, p < 0 ? s.openEnd : e - 1) : new E(Ht(s.content, e, a), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !zr(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], u = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), s = zr(e, t, i, r, u);
      if (s) {
        for (let o = t - 1; o >= 0; o--) {
          let { match: l, type: a } = this.frontier[o], c = zr(e, o, a, l, !0);
          if (!c || c.childCount)
            continue e;
        }
        return { depth: t, fit: s, move: u ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = Ut(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), u = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, u);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Ut(this.placed, this.depth, k.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(k.empty, !0);
    t.childCount && (this.placed = Ut(this.placed, this.frontier.length, t));
  }
}
function Ht(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Ht(n.firstChild.content, e - 1, t)));
}
function Ut(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Ut(n.lastChild.content, e - 1, t)));
}
function Pr(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Fo(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Fo(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(k.empty, !0)))), n.copy(r);
}
function zr(n, e, t, r, i) {
  let u = n.node(e), s = i ? n.indexAfter(e) : n.index(e);
  if (s == u.childCount && !t.compatibleContent(u.type))
    return null;
  let o = r.fillBefore(u.content, !0, s);
  return o && !vc(t, u.content, s) ? o : null;
}
function vc(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Ic(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Rc(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), u = n.doc.resolve(t);
  if (No(i, u, r))
    return n.step(new U(e, t, r));
  let s = Io(i, u);
  s[s.length - 1] == 0 && s.pop();
  let o = -(i.depth + 1);
  s.unshift(o);
  for (let d = i.depth, p = i.pos - 1; d > 0; d--, p--) {
    let h = i.node(d).type.spec;
    if (h.defining || h.definingAsContext || h.isolating)
      break;
    s.indexOf(d) > -1 ? o = d : i.before(d) == p && s.splice(1, 0, -d);
  }
  let l = s.indexOf(o), a = [], c = r.openStart;
  for (let d = r.content, p = 0; ; p++) {
    let h = d.firstChild;
    if (a.push(h), p == r.openStart)
      break;
    d = h.content;
  }
  for (let d = c - 1; d >= 0; d--) {
    let p = a[d], h = Ic(p.type);
    if (h && !p.sameMarkup(i.node(Math.abs(o) - 1)))
      c = d;
    else if (h || !p.type.isTextblock)
      break;
  }
  for (let d = r.openStart; d >= 0; d--) {
    let p = (d + c + 1) % (r.openStart + 1), h = a[p];
    if (h)
      for (let m = 0; m < s.length; m++) {
        let g = s[(m + l) % s.length], b = !0;
        g < 0 && (b = !1, g = -g);
        let C = i.node(g - 1), D = i.index(g - 1);
        if (C.canReplaceWith(D, D, h.type, h.marks))
          return n.replace(i.before(g), b ? u.after(g) : t, new E(vo(r.content, 0, r.openStart, p), p, r.openEnd));
      }
  }
  let f = n.steps.length;
  for (let d = s.length - 1; d >= 0 && (n.replace(e, t, r), !(n.steps.length > f)); d--) {
    let p = s[d];
    p < 0 || (e = i.before(p), t = u.after(p));
  }
}
function vo(n, e, t, r, i) {
  if (e < t) {
    let u = n.firstChild;
    n = n.replaceChild(0, u.copy(vo(u.content, e + 1, t, r, u)));
  }
  if (e > r) {
    let u = i.contentMatchAt(0), s = u.fillBefore(n).append(n);
    n = s.append(u.matchFragment(s).fillBefore(k.empty, !0));
  }
  return n;
}
function Bc(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = Oc(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new E(k.from(r), 0, 0));
}
function $c(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t);
  if (r.parent.isTextblock && i.parent.isTextblock && r.start() != i.start() && r.parentOffset == 0 && i.parentOffset == 0) {
    let s = r.sharedDepth(t), o = !1;
    for (let l = r.depth; l > s; l--)
      r.node(l).type.spec.isolating && (o = !0);
    for (let l = i.depth; l > s; l--)
      i.node(l).type.spec.isolating && (o = !0);
    if (!o) {
      for (let l = r.depth; l > 0 && e == r.start(l); l--)
        e = r.before(l);
      for (let l = i.depth; l > 0 && t == i.start(l); l--)
        t = i.before(l);
      r = n.doc.resolve(e), i = n.doc.resolve(t);
    }
  }
  let u = Io(r, i);
  for (let s = 0; s < u.length; s++) {
    let o = u[s], l = s == u.length - 1;
    if (l && o == 0 || r.node(o).type.contentMatch.validEnd)
      return n.delete(r.start(o), i.end(o));
    if (o > 0 && (l || r.node(o - 1).canReplace(r.index(o - 1), i.indexAfter(o - 1))))
      return n.delete(r.before(o), i.after(o));
  }
  for (let s = 1; s <= r.depth && s <= i.depth; s++)
    if (e - r.start(s) == r.depth - s && t > r.end(s) && i.end(s) - t != i.depth - s && r.start(s - 1) == i.start(s - 1) && r.node(s - 1).canReplace(r.index(s - 1), i.index(s - 1)))
      return n.delete(r.before(s), t);
  n.delete(e, t);
}
function Io(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let u = n.start(i);
    if (u < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (u == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == u - 1) && t.push(i);
  }
  return t;
}
class wt extends Q {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return q.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let u in t.attrs)
      r[u] = t.attrs[u];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return q.fromReplace(e, this.pos, this.pos + 1, new E(k.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return ue.empty;
  }
  invert(e) {
    return new wt(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new wt(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new wt(t.pos, t.attr, t.value);
  }
}
Q.jsonID("attr", wt);
class cn extends Q {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e.attrs)
      t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return q.ok(r);
  }
  getMap() {
    return ue.empty;
  }
  invert(e) {
    return new cn(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new cn(t.attr, t.value);
  }
}
Q.jsonID("docAttr", cn);
let Ft = class extends Error {
};
Ft = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
Ft.prototype = Object.create(Error.prototype);
Ft.prototype.constructor = Ft;
Ft.prototype.name = "TransformError";
class Pc {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new an();
  }
  /**
  The starting document.
  */
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  /**
  Apply a new step in this transform, saving the result. Throws an
  error when the step fails.
  */
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new Ft(t.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  /**
  True when the document has been changed (when there are any
  steps).
  */
  get docChanged() {
    return this.steps.length > 0;
  }
  /**
  Return a single range, in post-transform document positions,
  that covers all content changed by this transform. Returns null
  if no replacements are made. Note that this will ignore changes
  that add/remove marks without replacing the underlying content.
  */
  changedRange() {
    let e = 1e9, t = -1e9;
    for (let r = 0; r < this.mapping.maps.length; r++) {
      let i = this.mapping.maps[r];
      r && (e = i.map(e, 1), t = i.map(t, -1)), i.forEach((u, s, o, l) => {
        e = Math.min(e, o), t = Math.max(t, l);
      });
    }
    return e == 1e9 ? null : { from: e, to: t };
  }
  /**
  @internal
  */
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, t = e, r = E.empty) {
    let i = Ui(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new E(k.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, E.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  /**
  Replace a range of the document with a given slice, using
  `from`, `to`, and the slice's
  [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
  than fixed start and end points. This method may grow the
  replaced area or close open nodes in the slice in order to get a
  fit that is more in line with WYSIWYG expectations, by dropping
  fully covered parent nodes of the replaced region when they are
  marked [non-defining as
  context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
  open parent node from the slice that _is_ marked as [defining
  its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
  
  This is the method, for example, to handle paste. The similar
  [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
  primitive tool which will _not_ move the start and end of its given
  range, and is useful in situations where you need more precise
  control over what happens.
  */
  replaceRange(e, t, r) {
    return Rc(this, e, t, r), this;
  }
  /**
  Replace the given range with a node, but use `from` and `to` as
  hints, rather than precise positions. When from and to are the same
  and are at the start or end of a parent node in which the given
  node doesn't fit, this method may _move_ them out towards a parent
  that does allow the given node to be placed. When the given range
  completely covers a parent node, this method may completely replace
  that parent node.
  */
  replaceRangeWith(e, t, r) {
    return Bc(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return $c(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return yc(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Tc(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return Dc(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return Sc(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return _c(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new wt(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new cn(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new We(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof N)
      t.isInSet(r.marks) && this.step(new gt(e, t));
    else {
      let i = r.marks, u, s = [];
      for (; u = t.isInSet(i); )
        s.push(new gt(e, u)), i = u.removeFromSet(i);
      for (let o = s.length - 1; o >= 0; o--)
        this.step(s[o]);
    }
    return this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split (with the outermost nodes coming first).
  */
  split(e, t = 1, r) {
    return wc(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return gc(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return bc(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Vi(this, e, t, r), this;
  }
}
const Lr = /* @__PURE__ */ Object.create(null);
class R {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new zc(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = E.empty) {
    let r = t.content.lastChild, i = null;
    for (let o = 0; o < t.openEnd; o++)
      i = r, r = r.lastChild;
    let u = e.steps.length, s = this.ranges;
    for (let o = 0; o < s.length; o++) {
      let { $from: l, $to: a } = s[o], c = e.mapping.slice(u);
      e.replaceRange(c.map(l.pos), c.map(a.pos), o ? E.empty : t), o == 0 && zu(e, u, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let u = 0; u < i.length; u++) {
      let { $from: s, $to: o } = i[u], l = e.mapping.slice(r), a = l.map(s.pos), c = l.map(o.pos);
      u ? e.deleteRange(a, c) : (e.replaceRangeWith(a, c, t), zu(e, r, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, r = !1) {
    let i = e.parent.inlineContent ? new I(e) : Dt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let u = e.depth - 1; u >= 0; u--) {
      let s = t < 0 ? Dt(e.node(0), e.node(u), e.before(u + 1), e.index(u), t, r) : Dt(e.node(0), e.node(u), e.after(u + 1), e.index(u) + 1, t, r);
      if (s)
        return s;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new oe(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Dt(e, e, 0, 0, 1) || new oe(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Dt(e, e, e.content.size, e.childCount, -1) || new oe(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Lr[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in Lr)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Lr[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return I.between(this.$anchor, this.$head).getBookmark();
  }
}
R.prototype.visible = !0;
class zc {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let $u = !1;
function Pu(n) {
  !$u && !n.parent.inlineContent && ($u = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class I extends R {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Pu(e), Pu(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return R.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new I(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = E.empty) {
    if (super.replace(e, t), t == E.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof I && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Cr(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new I(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, r) {
    let i = e.pos - t.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let u = R.findFrom(t, r, !0) || R.findFrom(t, -r, !0);
      if (u)
        t = u.$head;
      else
        return R.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (R.findFrom(e, -r, !0) || R.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new I(e, t);
  }
}
R.jsonID("text", I);
class Cr {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Cr(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return I.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class T extends R {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor), u = e.resolve(i);
    return r ? R.near(u) : new T(u);
  }
  content() {
    return new E(k.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof T && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Wi(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new T(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new T(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
T.prototype.visible = !1;
R.jsonID("node", T);
class Wi {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Cr(r, r) : new Wi(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && T.isSelectable(r) ? new T(t) : R.near(t);
  }
}
class oe extends R {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = E.empty) {
    if (t == E.empty) {
      e.delete(0, e.doc.content.size);
      let r = R.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new oe(e);
  }
  map(e) {
    return new oe(e);
  }
  eq(e) {
    return e instanceof oe;
  }
  getBookmark() {
    return Lc;
  }
}
R.jsonID("all", oe);
const Lc = {
  map() {
    return this;
  },
  resolve(n) {
    return new oe(n);
  }
};
function Dt(n, e, t, r, i, u = !1) {
  if (e.inlineContent)
    return I.create(n, t);
  for (let s = r - (i > 0 ? 0 : 1); i > 0 ? s < e.childCount : s >= 0; s += i) {
    let o = e.child(s);
    if (o.isAtom) {
      if (!u && T.isSelectable(o))
        return T.create(n, t - (i < 0 ? o.nodeSize : 0));
    } else {
      let l = Dt(n, o, t + i, i < 0 ? o.childCount : 0, i, u);
      if (l)
        return l;
    }
    t += o.nodeSize * i;
  }
  return null;
}
function zu(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof U || i instanceof se))
    return;
  let u = n.mapping.maps[r], s;
  u.forEach((o, l, a, c) => {
    s == null && (s = c);
  }), n.setSelection(R.near(n.doc.resolve(s), t));
}
const Lu = 1, Hn = 2, Vu = 4;
class Vc extends Pc {
  /**
  @internal
  */
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  /**
  The transaction's current selection. This defaults to the editor
  selection [mapped](https://prosemirror.net/docs/ref/#state.Selection.map) through the steps in the
  transaction, but can be overwritten with
  [`setSelection`](https://prosemirror.net/docs/ref/#state.Transaction.setSelection).
  */
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  /**
  Update the transaction's current selection. Will determine the
  selection that the editor gets when the transaction is applied.
  */
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Lu) & ~Hn, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & Lu) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= Hn, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return N.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  /**
  Add a mark to the set of stored marks.
  */
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Remove a mark or mark type from the set of stored marks.
  */
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Whether the stored marks were explicitly set for this transaction.
  */
  get storedMarksSet() {
    return (this.updated & Hn) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~Hn, this.storedMarks = null;
  }
  /**
  Update the timestamp for the transaction.
  */
  setTime(e) {
    return this.time = e, this;
  }
  /**
  Replace the current selection with the given slice.
  */
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  /**
  Replace the selection with the given node. When `inheritMarks` is
  true and the content is inline, it inherits the marks from the
  place where it is inserted.
  */
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || N.none))), r.replaceWith(this, e), this;
  }
  /**
  Delete the selection.
  */
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  /**
  Replace the given range, or the selection if no range is given,
  with a text node containing the given string.
  */
  insertText(e, t, r) {
    let i = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(i.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), !e)
        return this.deleteRange(t, r);
      let u = this.storedMarks;
      if (!u) {
        let s = this.doc.resolve(t);
        u = r == t ? s.marks() : s.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, i.text(e, u)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(R.near(this.selection.$to)), this;
    }
  }
  /**
  Store a metadata property in this transaction, keyed either by
  name or by plugin.
  */
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  /**
  Retrieve a metadata property for a given name or plugin.
  */
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  /**
  Returns true if this transaction doesn't contain any metadata,
  and can thus safely be extended.
  */
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  /**
  Indicate that the editor should scroll the selection into view
  when updated to the state produced by this transaction.
  */
  scrollIntoView() {
    return this.updated |= Vu, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & Vu) > 0;
  }
}
function qu(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Wt {
  constructor(e, t, r) {
    this.name = e, this.init = qu(t.init, r), this.apply = qu(t.apply, r);
  }
}
const qc = [
  new Wt("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new Wt("selection", {
    init(n, e) {
      return n.selection || R.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new Wt("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new Wt("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class Vr {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = qc.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Wt(r.key, r.spec.state, r));
    });
  }
}
class _t {
  /**
  @internal
  */
  constructor(e) {
    this.config = e;
  }
  /**
  The schema of the state's document.
  */
  get schema() {
    return this.config.schema;
  }
  /**
  The plugins that are active in this state.
  */
  get plugins() {
    return this.config.plugins;
  }
  /**
  Apply the given transaction to produce a new state.
  */
  apply(e) {
    return this.applyTransaction(e).state;
  }
  /**
  @internal
  */
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let i = this.config.plugins[r];
        if (i.spec.filterTransaction && !i.spec.filterTransaction.call(i, e, this))
          return !1;
      }
    return !0;
  }
  /**
  Verbose variant of [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) that
  returns the precise transactions that were applied (which might
  be influenced by the [transaction
  hooks](https://prosemirror.net/docs/ref/#state.PluginSpec.filterTransaction) of
  plugins) along with the new state.
  */
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), i = null;
    for (; ; ) {
      let u = !1;
      for (let s = 0; s < this.config.plugins.length; s++) {
        let o = this.config.plugins[s];
        if (o.spec.appendTransaction) {
          let l = i ? i[s].n : 0, a = i ? i[s].state : this, c = l < t.length && o.spec.appendTransaction.call(o, l ? t.slice(l) : t, a, r);
          if (c && r.filterTransaction(c, s)) {
            if (c.setMeta("appendedTransaction", e), !i) {
              i = [];
              for (let f = 0; f < this.config.plugins.length; f++)
                i.push(f < s ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(c), r = r.applyInner(c), u = !0;
          }
          i && (i[s] = { state: r, n: t.length });
        }
      }
      if (!u)
        return { state: r, transactions: t };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new _t(this.config), r = this.config.fields;
    for (let i = 0; i < r.length; i++) {
      let u = r[i];
      t[u.name] = u.apply(e, this[u.name], this, t);
    }
    return t;
  }
  /**
  Accessor that constructs and returns a new [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new Vc(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new Vr(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new _t(t);
    for (let i = 0; i < t.fields.length; i++)
      r[t.fields[i].name] = t.fields[i].init(e, r);
    return r;
  }
  /**
  Create a new state based on this one, but with an adjusted set
  of active plugins. State fields that exist in both sets of
  plugins are kept unchanged. Those that no longer exist are
  dropped, and those that are new are initialized using their
  [`init`](https://prosemirror.net/docs/ref/#state.StateField.init) method, passing in the new
  configuration object..
  */
  reconfigure(e) {
    let t = new Vr(this.schema, e.plugins), r = t.fields, i = new _t(t);
    for (let u = 0; u < r.length; u++) {
      let s = r[u].name;
      i[s] = this.hasOwnProperty(s) ? this[s] : r[u].init(e, i);
    }
    return i;
  }
  /**
  Serialize this state to JSON. If you want to serialize the state
  of plugins, pass an object mapping property names to use in the
  resulting JSON object to plugin objects. The argument may also be
  a string or number, in which case it is ignored, to support the
  way `JSON.stringify` calls `toString` methods.
  */
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let i = e[r], u = i.spec.state;
        u && u.toJSON && (t[r] = u.toJSON.call(i, this[i.key]));
      }
    return t;
  }
  /**
  Deserialize a JSON representation of a state. `config` should
  have at least a `schema` field, and should contain array of
  plugins to initialize the state with. `pluginFields` can be used
  to deserialize the state of plugins, by associating plugin
  instances with the property names they use in the JSON object.
  */
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let i = new Vr(e.schema, e.plugins), u = new _t(i);
    return i.fields.forEach((s) => {
      if (s.name == "doc")
        u.doc = Ee.fromJSON(e.schema, t.doc);
      else if (s.name == "selection")
        u.selection = R.fromJSON(u.doc, t.selection);
      else if (s.name == "storedMarks")
        t.storedMarks && (u.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let o in r) {
            let l = r[o], a = l.spec.state;
            if (l.key == s.name && a && a.fromJSON && Object.prototype.hasOwnProperty.call(t, o)) {
              u[s.name] = a.fromJSON.call(l, e, t[o], u);
              return;
            }
          }
        u[s.name] = s.init(e, u);
      }
    }), u;
  }
}
function Ro(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = Ro(i, e, {})), t[r] = i;
  }
  return t;
}
class Dr {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Ro(e.props, this, this.props), this.key = e.key ? e.key.key : Bo("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const qr = /* @__PURE__ */ Object.create(null);
function Bo(n) {
  return n in qr ? n + "$" + ++qr[n] : (qr[n] = 0, n + "$");
}
class $o {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Bo(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Po = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Hc(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Uc = (n, e, t) => {
  let r = Hc(n, t);
  if (!r)
    return !1;
  let i = zo(r);
  if (!i) {
    let s = r.blockRange(), o = s && qi(s);
    return o == null ? !1 : (e && e(n.tr.lift(s, o).scrollIntoView()), !0);
  }
  let u = i.nodeBefore;
  if (qo(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (vt(u, "end") || T.isSelectable(u)))
    for (let s = r.depth; ; s--) {
      let o = Ui(n.doc, r.before(s), r.after(s), E.empty);
      if (o && o.slice.size < o.to - o.from) {
        if (e) {
          let l = n.tr.step(o);
          l.setSelection(vt(u, "end") ? R.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : T.create(l.doc, i.pos - u.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (s == 1 || r.node(s - 1).childCount > 1)
        break;
    }
  return u.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - u.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function vt(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Wc = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, u = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    u = zo(r);
  }
  let s = u && u.nodeBefore;
  return !s || !T.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(T.create(n.doc, u.pos - s.nodeSize)).scrollIntoView()), !0);
};
function zo(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function jc(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Jc = (n, e, t) => {
  let r = jc(n, t);
  if (!r)
    return !1;
  let i = Lo(r);
  if (!i)
    return !1;
  let u = i.nodeAfter;
  if (qo(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (vt(u, "start") || T.isSelectable(u))) {
    let s = Ui(n.doc, r.before(), r.after(), E.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let o = n.tr.step(s);
        o.setSelection(vt(u, "start") ? R.findFrom(o.doc.resolve(o.mapping.map(i.pos)), 1) : T.create(o.doc, o.mapping.map(i.pos))), e(o.scrollIntoView());
      }
      return !0;
    }
  }
  return u.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + u.nodeSize).scrollIntoView()), !0) : !1;
}, Kc = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, u = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    u = Lo(r);
  }
  let s = u && u.nodeAfter;
  return !s || !T.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(T.create(n.doc, u.pos)).scrollIntoView()), !0);
};
function Lo(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const Vo = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function ji(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Zc = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), u = t.indexAfter(-1), s = ji(i.contentMatchAt(u));
  if (!s || !i.canReplaceWith(u, u, s))
    return !1;
  if (e) {
    let o = t.after(), l = n.tr.replaceWith(o, o, s.createAndFill());
    l.setSelection(R.near(l.doc.resolve(o), 1)), e(l.scrollIntoView());
  }
  return !0;
}, Gc = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof oe || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let u = ji(i.parent.contentMatchAt(i.indexAfter()));
  if (!u || !u.isTextblock)
    return !1;
  if (e) {
    let s = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = n.tr.insert(s, u.createAndFill());
    o.setSelection(I.create(o.doc, s + 1)), e(o.scrollIntoView());
  }
  return !0;
}, Yc = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let u = t.before();
    if (Xn(n.doc, u))
      return e && e(n.tr.split(u).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && qi(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function Xc(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof T && e.selection.node.isBlock)
      return !r.parentOffset || !Xn(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let u = [], s, o, l = !1, a = !1;
    for (let p = r.depth; ; p--)
      if (r.node(p).isBlock) {
        l = r.end(p) == r.pos + (r.depth - p), a = r.start(p) == r.pos - (r.depth - p), o = ji(r.node(p - 1).contentMatchAt(r.indexAfter(p - 1))), u.unshift(l && o ? { type: o } : null), s = p;
        break;
      } else {
        if (p == 1)
          return !1;
        u.unshift(null);
      }
    let c = e.tr;
    (e.selection instanceof I || e.selection instanceof oe) && c.deleteSelection();
    let f = c.mapping.map(r.pos), d = Xn(c.doc, f, u.length, u);
    if (d || (u[0] = o ? { type: o } : null, d = Xn(c.doc, f, u.length, u)), !d)
      return !1;
    if (c.split(f, u.length, u), !l && a && r.node(s).type != o) {
      let p = c.mapping.map(r.before(s)), h = c.doc.resolve(p);
      o && r.node(s - 1).canReplaceWith(h.index(), h.index() + 1, o) && c.setNodeMarkup(c.mapping.map(r.before(s)), o);
    }
    return t && t(c.scrollIntoView()), !0;
  };
}
const Qc = Xc(), ef = (n, e) => (e && e(n.tr.setSelection(new oe(n.doc))), !0);
function tf(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, u = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(u - 1, u) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(u, u + 1) || !(i.isTextblock || Hi(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function qo(n, e, t, r) {
  let i = e.nodeBefore, u = e.nodeAfter, s, o, l = i.type.spec.isolating || u.type.spec.isolating;
  if (!l && tf(n, e, t))
    return !0;
  let a = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (a && (s = (o = i.contentMatchAt(i.childCount)).findWrapping(u.type)) && o.matchType(s[0] || u.type).validEnd) {
    if (t) {
      let p = e.pos + u.nodeSize, h = k.empty;
      for (let b = s.length - 1; b >= 0; b--)
        h = k.from(s[b].create(null, h));
      h = k.from(i.copy(h));
      let m = n.tr.step(new se(e.pos - 1, p, e.pos, p, new E(h, 1, 0), s.length, !0)), g = m.doc.resolve(p + 2 * s.length);
      g.nodeAfter && g.nodeAfter.type == i.type && Hi(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let c = u.type.spec.isolating || r > 0 && l ? null : R.findFrom(e, 1), f = c && c.$from.blockRange(c.$to), d = f && qi(f);
  if (d != null && d >= e.depth)
    return t && t(n.tr.lift(f, d).scrollIntoView()), !0;
  if (a && vt(u, "start", !0) && vt(i, "end")) {
    let p = i, h = [];
    for (; h.push(p), !p.isTextblock; )
      p = p.lastChild;
    let m = u, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (p.canReplace(p.childCount, p.childCount, m.content)) {
      if (t) {
        let b = k.empty;
        for (let D = h.length - 1; D >= 0; D--)
          b = k.from(h[D].copy(b));
        let C = n.tr.step(new se(e.pos - h.length, e.pos + u.nodeSize, e.pos + g, e.pos + u.nodeSize - g, new E(b, h.length, 0), 0, !0));
        t(C.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ho(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, u = i.depth;
    for (; i.node(u).isInline; ) {
      if (!u)
        return !1;
      u--;
    }
    return i.node(u).isTextblock ? (t && t(e.tr.setSelection(I.create(e.doc, n < 0 ? i.start(u) : i.end(u)))), !0) : !1;
  };
}
const nf = Ho(-1), rf = Ho(1);
function uf(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: u } = t.selection, s = i.blockRange(u), o = s && Mo(s, n, e);
    return o ? (r && r(t.tr.wrap(s, o).scrollIntoView()), !0) : !1;
  };
}
function Un(n, e = null) {
  return function(t, r) {
    let i = !1;
    for (let u = 0; u < t.selection.ranges.length && !i; u++) {
      let { $from: { pos: s }, $to: { pos: o } } = t.selection.ranges[u];
      t.doc.nodesBetween(s, o, (l, a) => {
        if (i)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(n, e)))
          if (l.type == n)
            i = !0;
          else {
            let c = t.doc.resolve(a), f = c.index();
            i = c.parent.canReplaceWith(f, f + 1, n);
          }
      });
    }
    if (!i)
      return !1;
    if (r) {
      let u = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let { $from: { pos: o }, $to: { pos: l } } = t.selection.ranges[s];
        u.setBlockType(o, l, n, e);
      }
      r(u.scrollIntoView());
    }
    return !0;
  };
}
function sf(n, e, t, r) {
  for (let i = 0; i < e.length; i++) {
    let { $from: u, $to: s } = e[i], o = u.depth == 0 ? n.inlineContent && n.type.allowsMarkType(t) : !1;
    if (n.nodesBetween(u.pos, s.pos, (l, a) => {
      if (o)
        return !1;
      o = l.inlineContent && l.type.allowsMarkType(t);
    }), o)
      return !0;
  }
  return !1;
}
function Wn(n, e = null, t) {
  return function(r, i) {
    let { empty: u, $cursor: s, ranges: o } = r.selection;
    if (u && !s || !sf(r.doc, o, n))
      return !1;
    if (i)
      if (s)
        n.isInSet(r.storedMarks || s.marks()) ? i(r.tr.removeStoredMark(n)) : i(r.tr.addStoredMark(n.create(e)));
      else {
        let l, a = r.tr;
        l = !o.some((c) => r.doc.rangeHasMark(c.$from.pos, c.$to.pos, n));
        for (let c = 0; c < o.length; c++) {
          let { $from: f, $to: d } = o[c];
          if (!l)
            a.removeMark(f.pos, d.pos, n);
          else {
            let p = f.pos, h = d.pos, m = f.nodeAfter, g = d.nodeBefore, b = m && m.isText ? /^\s*/.exec(m.text)[0].length : 0, C = g && g.isText ? /\s*$/.exec(g.text)[0].length : 0;
            p + b < h && (p += b, h -= C), a.addMark(p, h, n.create(e));
          }
        }
        i(a.scrollIntoView());
      }
    return !0;
  };
}
function Sr(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
let Hr = Sr(Po, Uc, Wc), Hu = Sr(Po, Jc, Kc);
const Oe = {
  Enter: Sr(Vo, Gc, Yc, Qc),
  "Mod-Enter": Zc,
  Backspace: Hr,
  "Mod-Backspace": Hr,
  "Shift-Backspace": Hr,
  Delete: Hu,
  "Mod-Delete": Hu,
  "Mod-a": ef
}, Uo = {
  "Ctrl-h": Oe.Backspace,
  "Alt-Backspace": Oe["Mod-Backspace"],
  "Ctrl-d": Oe.Delete,
  "Ctrl-Alt-Backspace": Oe["Mod-Delete"],
  "Alt-Delete": Oe["Mod-Delete"],
  "Alt-d": Oe["Mod-Delete"],
  "Ctrl-a": nf,
  "Ctrl-e": rf
};
for (let n in Oe)
  Uo[n] = Oe[n];
const of = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform ? os.platform() == "darwin" : !1, lf = of ? Uo : Oe;
var lr = 200, J = function() {
};
J.prototype.append = function(e) {
  return e.length ? (e = J.from(e), !this.length && e || e.length < lr && this.leafAppend(e) || this.length < lr && e.leafPrepend(this) || this.appendInner(e)) : this;
};
J.prototype.prepend = function(e) {
  return e.length ? J.from(e).append(this) : this;
};
J.prototype.appendInner = function(e) {
  return new af(this, e);
};
J.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? J.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
J.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
J.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
J.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(u, s) {
    return i.push(e(u, s));
  }, t, r), i;
};
J.from = function(e) {
  return e instanceof J ? e : e && e.length ? new Wo(e) : J.empty;
};
var Wo = /* @__PURE__ */ (function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(i, u) {
    return i == 0 && u == this.length ? this : new e(this.values.slice(i, u));
  }, e.prototype.getInner = function(i) {
    return this.values[i];
  }, e.prototype.forEachInner = function(i, u, s, o) {
    for (var l = u; l < s; l++)
      if (i(this.values[l], o + l) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, u, s, o) {
    for (var l = u - 1; l >= s; l--)
      if (i(this.values[l], o + l) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= lr)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= lr)
      return new e(i.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
})(J);
J.empty = new Wo([]);
var af = /* @__PURE__ */ (function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, u, s) {
    var o = this.left.length;
    if (i < o && this.left.forEachInner(r, i, Math.min(u, o), s) === !1 || u > o && this.right.forEachInner(r, Math.max(i - o, 0), Math.min(this.length, u) - o, s + o) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, u, s) {
    var o = this.left.length;
    if (i > o && this.right.forEachInvertedInner(r, i - o, Math.max(u, o) - o, s + o) === !1 || u < o && this.left.forEachInvertedInner(r, Math.min(i, o), u, s) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, i) {
    if (r == 0 && i == this.length)
      return this;
    var u = this.left.length;
    return i <= u ? this.left.slice(r, i) : r >= u ? this.right.slice(r - u, i - u) : this.left.slice(r, u).append(this.right.slice(0, i - u));
  }, e.prototype.leafAppend = function(r) {
    var i = this.right.leafAppend(r);
    if (i)
      return new e(this.left, i);
  }, e.prototype.leafPrepend = function(r) {
    var i = this.left.leafPrepend(r);
    if (i)
      return new e(i, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
})(J);
const cf = 500;
class ge {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let i, u;
    t && (i = this.remapping(r, this.items.length), u = i.maps.length);
    let s = e.tr, o, l, a = [], c = [];
    return this.items.forEach((f, d) => {
      if (!f.step) {
        i || (i = this.remapping(r, d + 1), u = i.maps.length), u--, c.push(f);
        return;
      }
      if (i) {
        c.push(new ke(f.map));
        let p = f.step.map(i.slice(u)), h;
        p && s.maybeStep(p).doc && (h = s.mapping.maps[s.mapping.maps.length - 1], a.push(new ke(h, void 0, void 0, a.length + c.length))), u--, h && i.appendMap(h, u);
      } else
        s.maybeStep(f.step);
      if (f.selection)
        return o = i ? f.selection.map(i.slice(u)) : f.selection, l = new ge(this.items.slice(0, r).append(c.reverse().concat(a)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: l, transform: s, selection: o };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, i) {
    let u = [], s = this.eventCount, o = this.items, l = !i && o.length ? o.get(o.length - 1) : null;
    for (let c = 0; c < e.steps.length; c++) {
      let f = e.steps[c].invert(e.docs[c]), d = new ke(e.mapping.maps[c], f, t), p;
      (p = l && l.merge(d)) && (d = p, c ? u.pop() : o = o.slice(0, o.length - 1)), u.push(d), t && (s++, t = void 0), i || (l = d);
    }
    let a = s - r.depth;
    return a > hf && (o = ff(o, a), s -= a), new ge(o.append(u), s);
  }
  remapping(e, t) {
    let r = new an();
    return this.items.forEach((i, u) => {
      let s = i.mirrorOffset != null && u - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, s);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new ge(this.items.append(e.map((t) => new ke(t))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - t), u = e.mapping, s = e.steps.length, o = this.eventCount;
    this.items.forEach((d) => {
      d.selection && o--;
    }, i);
    let l = t;
    this.items.forEach((d) => {
      let p = u.getMirror(--l);
      if (p == null)
        return;
      s = Math.min(s, p);
      let h = u.maps[p];
      if (d.step) {
        let m = e.steps[p].invert(e.docs[p]), g = d.selection && d.selection.map(u.slice(l + 1, p));
        g && o++, r.push(new ke(h, m, g));
      } else
        r.push(new ke(h));
    }, i);
    let a = [];
    for (let d = t; d < s; d++)
      a.push(new ke(u.maps[d]));
    let c = this.items.slice(0, i).append(a).append(r), f = new ge(c, o);
    return f.emptyItemCount() > cf && (f = f.compress(this.items.length - r.length)), f;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, i = [], u = 0;
    return this.items.forEach((s, o) => {
      if (o >= e)
        i.push(s), s.selection && u++;
      else if (s.step) {
        let l = s.step.map(t.slice(r)), a = l && l.getMap();
        if (r--, a && t.appendMap(a, r), l) {
          let c = s.selection && s.selection.map(t.slice(r));
          c && u++;
          let f = new ke(a.invert(), l, c), d, p = i.length - 1;
          (d = i.length && i[p].merge(f)) ? i[p] = d : i.push(f);
        }
      } else s.map && r--;
    }, this.items.length, 0), new ge(J.from(i.reverse()), u);
  }
}
ge.empty = new ge(J.empty, 0);
function ff(n, e) {
  let t;
  return n.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return t = i, !1;
  }), n.slice(t);
}
class ke {
  constructor(e, t, r, i) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new ke(t.getMap().invert(), t, this.selection);
    }
  }
}
class $e {
  constructor(e, t, r, i, u) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = i, this.prevComposition = u;
  }
}
const hf = 20;
function df(n, e, t, r) {
  let i = t.getMeta(ft), u;
  if (i)
    return i.historyState;
  t.getMeta(gf) && (n = new $e(n.done, n.undone, null, 0, -1));
  let s = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (s && s.getMeta(ft))
    return s.getMeta(ft).redo ? new $e(n.done.addTransform(t, void 0, r, Qn(e)), n.undone, Uu(t.mapping.maps), n.prevTime, n.prevComposition) : new $e(n.done, n.undone.addTransform(t, void 0, r, Qn(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(s && s.getMeta("addToHistory") === !1)) {
    let o = t.getMeta("composition"), l = n.prevTime == 0 || !s && n.prevComposition != o && (n.prevTime < (t.time || 0) - r.newGroupDelay || !pf(t, n.prevRanges)), a = s ? Ur(n.prevRanges, t.mapping) : Uu(t.mapping.maps);
    return new $e(n.done.addTransform(t, l ? e.selection.getBookmark() : void 0, r, Qn(e)), ge.empty, a, t.time, o ?? n.prevComposition);
  } else return (u = t.getMeta("rebased")) ? new $e(n.done.rebased(t, u), n.undone.rebased(t, u), Ur(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new $e(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), Ur(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function pf(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, i) => {
    for (let u = 0; u < e.length; u += 2)
      r <= e[u + 1] && i >= e[u] && (t = !0);
  }), t;
}
function Uu(n) {
  let e = [];
  for (let t = n.length - 1; t >= 0 && e.length == 0; t--)
    n[t].forEach((r, i, u, s) => e.push(u, s));
  return e;
}
function Ur(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1), u = e.map(n[r + 1], -1);
    i <= u && t.push(i, u);
  }
  return t;
}
function mf(n, e, t) {
  let r = Qn(e), i = ft.get(e).spec.config, u = (t ? n.undone : n.done).popEvent(e, r);
  if (!u)
    return null;
  let s = u.selection.resolve(u.transform.doc), o = (t ? n.done : n.undone).addTransform(u.transform, e.selection.getBookmark(), i, r), l = new $e(t ? o : u.remaining, t ? u.remaining : o, null, 0, -1);
  return u.transform.setSelection(s).setMeta(ft, { redo: t, historyState: l });
}
let Wr = !1, Wu = null;
function Qn(n) {
  let e = n.plugins;
  if (Wu != e) {
    Wr = !1, Wu = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        Wr = !0;
        break;
      }
  }
  return Wr;
}
const ft = new $o("history"), gf = new $o("closeHistory");
function bf(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new Dr({
    key: ft,
    state: {
      init() {
        return new $e(ge.empty, ge.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return df(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, i = r == "historyUndo" ? ar : r == "historyRedo" ? Yt : null;
          return !i || !e.editable ? !1 : (t.preventDefault(), i(e.state, e.dispatch));
        }
      }
    }
  });
}
function jo(n, e) {
  return (t, r) => {
    let i = ft.getState(t);
    if (!i || (n ? i.undone : i.done).eventCount == 0)
      return !1;
    if (r) {
      let u = mf(i, t, n);
      u && r(e ? u.scrollIntoView() : u);
    }
    return !0;
  };
}
const ar = jo(!1, !0), Yt = jo(!0, !0);
var Ye = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, cr = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, xf = typeof navigator < "u" && /Mac/.test(navigator.platform), yf = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Z = 0; Z < 10; Z++) Ye[48 + Z] = Ye[96 + Z] = String(Z);
for (var Z = 1; Z <= 24; Z++) Ye[Z + 111] = "F" + Z;
for (var Z = 65; Z <= 90; Z++)
  Ye[Z] = String.fromCharCode(Z + 32), cr[Z] = String.fromCharCode(Z);
for (var jr in Ye) cr.hasOwnProperty(jr) || (cr[jr] = Ye[jr]);
function kf(n) {
  var e = xf && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || yf && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? cr : Ye)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Cf = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Df = typeof navigator < "u" && /Win/.test(navigator.platform);
function Sf(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, u, s;
  for (let o = 0; o < e.length - 1; o++) {
    let l = e[o];
    if (/^(cmd|meta|m)$/i.test(l))
      s = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      u = !0;
    else if (/^mod$/i.test(l))
      Cf ? s = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), s && (t = "Meta-" + t), u && (t = "Shift-" + t), t;
}
function Ef(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Sf(t)] = n[t];
  return e;
}
function Jr(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function er(n) {
  return new Dr({ props: { handleKeyDown: _f(n) } });
}
function _f(n) {
  let e = Ef(n);
  return function(t, r) {
    let i = kf(r), u, s = e[Jr(i, r)];
    if (s && s(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let o = e[Jr(i, r, !1)];
        if (o && o(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(Df && r.ctrlKey && r.altKey) && (u = Ye[r.keyCode]) && u != i) {
        let o = e[Jr(u, r)];
        if (o && o(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
const G = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, It = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let pi = null;
const Te = function(n, e, t) {
  let r = pi || (pi = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, wf = function() {
  pi = null;
}, bt = function(n, e, t, r) {
  return t && (ju(n, e, t, r, -1) || ju(n, e, t, r, 1));
}, Af = /^(img|br|input|textarea|hr)$/i;
function ju(n, e, t, r, i) {
  for (var u; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : fe(n))) {
      let s = n.parentNode;
      if (!s || s.nodeType != 1 || Fn(n) || Af.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = G(n) + (i < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      let s = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (s.nodeType == 1 && s.contentEditable == "false")
        if (!((u = s.pmViewDesc) === null || u === void 0) && u.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = s, e = i < 0 ? fe(n) : 0;
    } else
      return !1;
  }
}
function fe(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Mf(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = fe(n);
    } else if (n.parentNode && !Fn(n))
      e = G(n), n = n.parentNode;
    else
      return null;
  }
}
function Tf(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !Fn(n))
      e = G(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function Of(n, e, t) {
  for (let r = e == 0, i = e == fe(n); r || i; ) {
    if (n == t)
      return !0;
    let u = G(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && u == 0, i = i && u == fe(n);
  }
}
function Fn(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Er = function(n) {
  return n.focusNode && bt(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function rt(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function Nf(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Ff(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(fe(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(fe(r.startContainer), r.startOffset) };
  }
}
const _e = typeof navigator < "u" ? navigator : null, Ju = typeof document < "u" ? document : null, Qe = _e && _e.userAgent || "", mi = /Edge\/(\d+)/.exec(Qe), Jo = /MSIE \d/.exec(Qe), gi = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Qe), re = !!(Jo || gi || mi), Je = Jo ? document.documentMode : gi ? +gi[1] : mi ? +mi[1] : 0, de = !re && /gecko\/(\d+)/i.test(Qe);
de && +(/Firefox\/(\d+)/.exec(Qe) || [0, 0])[1];
const bi = !re && /Chrome\/(\d+)/.exec(Qe), j = !!bi, Ko = bi ? +bi[1] : 0, X = !re && !!_e && /Apple Computer/.test(_e.vendor), Rt = X && (/Mobile\/\w+/.test(Qe) || !!_e && _e.maxTouchPoints > 2), ce = Rt || (_e ? /Mac/.test(_e.platform) : !1), Zo = _e ? /Win/.test(_e.platform) : !1, ve = /Android \d/.test(Qe), vn = !!Ju && "webkitFontSmoothing" in Ju.documentElement.style, vf = vn ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function If(n) {
  let e = n.defaultView && n.defaultView.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function Me(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Rf(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function Ku(n, e, t) {
  if (!xi(e) && e.left == 0)
    return;
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, u = n.dom.ownerDocument;
  for (let s = t || n.dom; s; ) {
    if (s.nodeType != 1) {
      s = It(s);
      continue;
    }
    let o = s, l = o == u.body, a = l ? If(u) : Rf(o), c = 0, f = 0;
    if (e.top < a.top + Me(r, "top") ? f = -(a.top - e.top + Me(i, "top")) : e.bottom > a.bottom - Me(r, "bottom") && (f = e.bottom - e.top > a.bottom - a.top ? e.top + Me(i, "top") - a.top : e.bottom - a.bottom + Me(i, "bottom")), e.left < a.left + Me(r, "left") ? c = -(a.left - e.left + Me(i, "left")) : e.right > a.right - Me(r, "right") && (c = e.right - a.right + Me(i, "right")), c || f)
      if (l)
        u.defaultView.scrollBy(c, f);
      else {
        let p = o.scrollLeft, h = o.scrollTop;
        f && (o.scrollTop += f), c && (o.scrollLeft += c);
        let m = o.scrollLeft - p, g = o.scrollTop - h;
        e = { left: e.left - m, top: e.top - g, right: e.right - m, bottom: e.bottom - g };
      }
    let d = l ? "fixed" : getComputedStyle(s).position;
    if (/^(fixed|sticky)$/.test(d))
      break;
    s = d == "absolute" ? s.offsetParent : It(s);
  }
}
function Bf(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, i;
  for (let u = (e.left + e.right) / 2, s = t + 1; s < Math.min(innerHeight, e.bottom); s += 5) {
    let o = n.root.elementFromPoint(u, s);
    if (!o || o == n.dom || !n.dom.contains(o))
      continue;
    let l = o.getBoundingClientRect();
    if (l.top >= t - 20) {
      r = o, i = l.top;
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: Go(n.dom) };
}
function Go(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = It(r))
    ;
  return e;
}
function $f({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Yo(t, r == 0 ? 0 : r - e);
}
function Yo(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: u } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != u && (r.scrollLeft = u);
  }
}
let yt = null;
function Pf(n) {
  if (n.setActive)
    return n.setActive();
  if (yt)
    return n.focus(yt);
  let e = Go(n);
  n.focus(yt == null ? {
    get preventScroll() {
      return yt = { preventScroll: !0 }, !0;
    }
  } : void 0), yt || (yt = !1, Yo(e, 0));
}
function Xo(n, e) {
  let t, r = 2e8, i, u = 0, s = e.top, o = e.top, l, a;
  for (let c = n.firstChild, f = 0; c; c = c.nextSibling, f++) {
    let d;
    if (c.nodeType == 1)
      d = c.getClientRects();
    else if (c.nodeType == 3)
      d = Te(c).getClientRects();
    else
      continue;
    for (let p = 0; p < d.length; p++) {
      let h = d[p];
      if (h.top <= s && h.bottom >= o) {
        s = Math.max(h.bottom, s), o = Math.min(h.top, o);
        let m = h.left > e.left ? h.left - e.left : h.right < e.left ? e.left - h.right : 0;
        if (m < r) {
          t = c, r = m, i = m && t.nodeType == 3 ? {
            left: h.right < e.left ? h.right : h.left,
            top: e.top
          } : e, c.nodeType == 1 && m && (u = f + (e.left >= (h.left + h.right) / 2 ? 1 : 0));
          continue;
        }
      } else h.top > e.top && !l && h.left <= e.left && h.right >= e.left && (l = c, a = { left: Math.max(h.left, Math.min(h.right, e.left)), top: h.top });
      !t && (e.left >= h.right && e.top >= h.top || e.left >= h.left && e.top >= h.bottom) && (u = f + 1);
    }
  }
  return !t && l && (t = l, i = a, r = 0), t && t.nodeType == 3 ? zf(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: u } : Xo(t, i);
}
function zf(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let u = 0; u < t; u++) {
    r.setEnd(n, u + 1), r.setStart(n, u);
    let s = Be(r, 1);
    if (s.top != s.bottom && Ji(e, s)) {
      i = { node: n, offset: u + (e.left >= (s.left + s.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function Ji(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Lf(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function Vf(n, e, t) {
  let { node: r, offset: i } = Xo(e, t), u = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let s = r.getBoundingClientRect();
    u = s.left != s.right && t.left > (s.left + s.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, u);
}
function qf(n, e, t, r) {
  let i = -1;
  for (let u = e, s = !1; u != n.dom; ) {
    let o = n.docView.nearestDesc(u, !0), l;
    if (!o)
      return null;
    if (o.dom.nodeType == 1 && (o.node.isBlock && o.parent || !o.contentDOM) && // Ignore elements with zero-size bounding rectangles
    ((l = o.dom.getBoundingClientRect()).width || l.height) && (o.node.isBlock && o.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(o.dom.nodeName) && (!s && l.left > r.left || l.top > r.top ? i = o.posBefore : (!s && l.right < r.left || l.bottom < r.top) && (i = o.posAfter), s = !0), !o.contentDOM && i < 0 && !o.node.isText))
      return (o.node.isBlock ? r.top < (l.top + l.bottom) / 2 : r.left < (l.left + l.right) / 2) ? o.posBefore : o.posAfter;
    u = o.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, -1);
}
function Qo(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), u = i; ; ) {
      let s = n.childNodes[u];
      if (s.nodeType == 1) {
        let o = s.getClientRects();
        for (let l = 0; l < o.length; l++) {
          let a = o[l];
          if (Ji(e, a))
            return Qo(s, e, a);
        }
      }
      if ((u = (u + 1) % r) == i)
        break;
    }
  return n;
}
function Hf(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, u = Ff(t, e.left, e.top);
  u && ({ node: r, offset: i } = u);
  let s = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), o;
  if (!s || !n.dom.contains(s.nodeType != 1 ? s.parentNode : s)) {
    let a = n.dom.getBoundingClientRect();
    if (!Ji(e, a) || (s = Qo(n.dom, e, a), !s))
      return null;
  }
  if (X)
    for (let a = s; r && a; a = It(a))
      a.draggable && (r = void 0);
  if (s = Lf(s, e), r) {
    if (de && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let c = r.childNodes[i], f;
      c.nodeName == "IMG" && (f = c.getBoundingClientRect()).right <= e.left && f.bottom > e.top && i++;
    }
    let a;
    vn && i && r.nodeType == 1 && (a = r.childNodes[i - 1]).nodeType == 1 && a.contentEditable == "false" && a.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? o = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (o = qf(n, r, i, e));
  }
  o == null && (o = Vf(n, s, e));
  let l = n.docView.nearestDesc(s, !0);
  return { pos: o, inside: l ? l.posAtStart - l.border : -1 };
}
function xi(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Be(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (xi(r))
      return r;
  }
  return Array.prototype.find.call(t, xi) || n.getBoundingClientRect();
}
const Uf = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function el(n, e, t) {
  let { node: r, offset: i, atom: u } = n.docView.domFromPos(e, t < 0 ? -1 : 1), s = vn || de;
  if (r.nodeType == 3)
    if (s && (Uf.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = Be(Te(r, i, i), t);
      if (de && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let a = Be(Te(r, i - 1, i - 1), -1);
        if (a.top == l.top) {
          let c = Be(Te(r, i, i + 1), -1);
          if (c.top != l.top)
            return Vt(c, c.left < a.left);
        }
      }
      return l;
    } else {
      let l = i, a = i, c = t < 0 ? 1 : -1;
      return t < 0 && !i ? (a++, c = -1) : t >= 0 && i == r.nodeValue.length ? (l--, c = 1) : t < 0 ? l-- : a++, Vt(Be(Te(r, l, a), c), c < 0);
    }
  if (!n.state.doc.resolve(e - (u || 0)).parent.inlineContent) {
    if (u == null && i && (t < 0 || i == fe(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return Kr(l.getBoundingClientRect(), !1);
    }
    if (u == null && i < fe(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return Kr(l.getBoundingClientRect(), !0);
    }
    return Kr(r.getBoundingClientRect(), t >= 0);
  }
  if (u == null && i && (t < 0 || i == fe(r))) {
    let l = r.childNodes[i - 1], a = l.nodeType == 3 ? Te(l, fe(l) - (s ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (a)
      return Vt(Be(a, 1), !1);
  }
  if (u == null && i < fe(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let a = l ? l.nodeType == 3 ? Te(l, 0, s ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (a)
      return Vt(Be(a, -1), !0);
  }
  return Vt(Be(r.nodeType == 3 ? Te(r) : r, -t), t >= 0);
}
function Vt(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Kr(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function tl(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function Wf(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return tl(n, e, () => {
    let { node: u } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let o = n.docView.nearestDesc(u, !0);
      if (!o)
        break;
      if (o.node.isBlock) {
        u = o.contentDOM || o.dom;
        break;
      }
      u = o.dom.parentNode;
    }
    let s = el(n, i.pos, 1);
    for (let o = u.firstChild; o; o = o.nextSibling) {
      let l;
      if (o.nodeType == 1)
        l = o.getClientRects();
      else if (o.nodeType == 3)
        l = Te(o, 0, o.nodeValue.length).getClientRects();
      else
        continue;
      for (let a = 0; a < l.length; a++) {
        let c = l[a];
        if (c.bottom > c.top + 1 && (t == "up" ? s.top - c.top > (c.bottom - s.top) * 2 : c.bottom - s.bottom > (s.bottom - c.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const jf = /[\u0590-\u08ac]/;
function Jf(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, u = !i, s = i == r.parent.content.size, o = n.domSelection();
  return o ? !jf.test(r.parent.textContent) || !o.modify ? t == "left" || t == "backward" ? u : s : tl(n, e, () => {
    let { focusNode: l, focusOffset: a, anchorNode: c, anchorOffset: f } = n.domSelectionRange(), d = o.caretBidiLevel;
    o.modify("move", t, "character");
    let p = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: h, focusOffset: m } = n.domSelectionRange(), g = h && !p.contains(h.nodeType == 1 ? h : h.parentNode) || l == h && a == m;
    try {
      o.collapse(c, f), l && (l != c || a != f) && o.extend && o.extend(l, a);
    } catch {
    }
    return d != null && (o.caretBidiLevel = d), g;
  }) : r.pos == r.start() || r.pos == r.end();
}
let Zu = null, Gu = null, Yu = !1;
function Kf(n, e, t) {
  return Zu == e && Gu == t ? Yu : (Zu = e, Gu = t, Yu = t == "up" || t == "down" ? Wf(n, e, t) : Jf(n, e, t));
}
const pe = 0, Xu = 1, ut = 2, be = 3;
class In {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = pe, r.pmViewDesc = this;
  }
  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  // When parsing in-editor content (in domchange.js), we allow
  // descriptions to determine the parse rules that should be used to
  // parse them.
  parseRule() {
    return null;
  }
  // Used by the editor's event handler to ignore events that come
  // from certain descs.
  stopEvent(e) {
    return !1;
  }
  // The size of the content represented by this desc.
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  // For block nodes, this represents the space taken up by their
  // start/end tokens.
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let i = this.children[t];
      if (i == e)
        return r;
      r += i.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let u, s;
        if (e == this.contentDOM)
          u = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          u = e.previousSibling;
        }
        for (; u && !((s = u.pmViewDesc) && s.parent == this); )
          u = u.previousSibling;
        return u ? this.posBeforeChild(s) + s.size : this.posAtStart;
      } else {
        let u, s;
        if (e == this.contentDOM)
          u = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          u = e.nextSibling;
        }
        for (; u && !((s = u.pmViewDesc) && s.parent == this); )
          u = u.nextSibling;
        return u ? this.posBeforeChild(s) : this.posAtEnd;
      }
    let i;
    if (e == this.dom && this.contentDOM)
      i = t > G(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      i = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let u = e; ; u = u.parentNode) {
          if (u == this.dom) {
            i = !1;
            break;
          }
          if (u.previousSibling)
            break;
        }
      if (i == null && t == e.childNodes.length)
        for (let u = e; ; u = u.parentNode) {
          if (u == this.dom) {
            i = !0;
            break;
          }
          if (u.nextSibling)
            break;
        }
    }
    return i ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, i = e; i; i = i.parentNode) {
      let u = this.getDesc(i), s;
      if (u && (!t || u.node))
        if (r && (s = u.nodeDOM) && !(s.nodeType == 1 ? s.contains(e.nodeType == 1 ? e : e.parentNode) : s == e))
          r = !1;
        else
          return u;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let i = e; i; i = i.parentNode) {
      let u = this.getDesc(i);
      if (u)
        return u.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let i = this.children[t], u = r + i.size;
      if (r == e && u != r) {
        for (; !i.border && i.children.length; )
          for (let s = 0; s < i.children.length; s++) {
            let o = i.children[s];
            if (o.size) {
              i = o;
              break;
            }
          }
        return i;
      }
      if (e < u)
        return i.descAt(e - r - i.border);
      r = u;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, i = 0;
    for (let u = 0; r < this.children.length; r++) {
      let s = this.children[r], o = u + s.size;
      if (o > e || s instanceof rl) {
        i = e - u;
        break;
      }
      u = o;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let u; r && !(u = this.children[r - 1]).size && u instanceof nl && u.side >= 0; r--)
      ;
    if (t <= 0) {
      let u, s = !0;
      for (; u = r ? this.children[r - 1] : null, !(!u || u.dom.parentNode == this.contentDOM); r--, s = !1)
        ;
      return u && t && s && !u.border && !u.domAtom ? u.domFromPos(u.size, t) : { node: this.contentDOM, offset: u ? G(u.dom) + 1 : 0 };
    } else {
      let u, s = !0;
      for (; u = r < this.children.length ? this.children[r] : null, !(!u || u.dom.parentNode == this.contentDOM); r++, s = !1)
        ;
      return u && s && !u.border && !u.domAtom ? u.domFromPos(0, t) : { node: this.contentDOM, offset: u ? G(u.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let i = -1, u = -1;
    for (let s = r, o = 0; ; o++) {
      let l = this.children[o], a = s + l.size;
      if (i == -1 && e <= a) {
        let c = s + l.border;
        if (e >= c && t <= a - l.border && l.node && l.contentDOM && this.contentDOM.contains(l.contentDOM))
          return l.parseRange(e, t, c);
        e = s;
        for (let f = o; f > 0; f--) {
          let d = this.children[f - 1];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(1)) {
            i = G(d.dom) + 1;
            break;
          }
          e -= d.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (a > t || o == this.children.length - 1)) {
        t = a;
        for (let c = o + 1; c < this.children.length; c++) {
          let f = this.children[c];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(-1)) {
            u = G(f.dom);
            break;
          }
          t += f.size;
        }
        u == -1 && (u = this.contentDOM.childNodes.length);
        break;
      }
      s = a;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: i, toOffset: u };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  setSelection(e, t, r, i = !1) {
    let u = Math.min(e, t), s = Math.max(e, t);
    for (let p = 0, h = 0; p < this.children.length; p++) {
      let m = this.children[p], g = h + m.size;
      if (u > h && s < g)
        return m.setSelection(e - h - m.border, t - h - m.border, r, i);
      h = g;
    }
    let o = this.domFromPos(e, e ? -1 : 1), l = t == e ? o : this.domFromPos(t, t ? -1 : 1), a = r.root.getSelection(), c = r.domSelectionRange(), f = !1;
    if ((de || X) && e == t) {
      let { node: p, offset: h } = o;
      if (p.nodeType == 3) {
        if (f = !!(h && p.nodeValue[h - 1] == `
`), f && h == p.nodeValue.length)
          for (let m = p, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (o = l = { node: g.parentNode, offset: G(g) + 1 });
              break;
            }
            let b = m.pmViewDesc;
            if (b && b.node && b.node.isBlock)
              break;
          }
      } else {
        let m = p.childNodes[h - 1];
        f = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (de && c.focusNode && c.focusNode != l.node && c.focusNode.nodeType == 1) {
      let p = c.focusNode.childNodes[c.focusOffset];
      p && p.contentEditable == "false" && (i = !0);
    }
    if (!(i || f && X) && bt(o.node, o.offset, c.anchorNode, c.anchorOffset) && bt(l.node, l.offset, c.focusNode, c.focusOffset))
      return;
    let d = !1;
    if ((a.extend || e == t) && !(f && de)) {
      a.collapse(o.node, o.offset);
      try {
        e != t && a.extend(l.node, l.offset), d = !0;
      } catch {
      }
    }
    if (!d) {
      if (e > t) {
        let h = o;
        o = l, l = h;
      }
      let p = document.createRange();
      p.setEnd(l.node, l.offset), p.setStart(o.node, o.offset), a.removeAllRanges(), a.addRange(p);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  // Remove a subtree of the element tree that has been touched
  // by a DOM change, so that the next update will redraw it.
  markDirty(e, t) {
    for (let r = 0, i = 0; i < this.children.length; i++) {
      let u = this.children[i], s = r + u.size;
      if (r == s ? e <= s && t >= r : e < s && t > r) {
        let o = r + u.border, l = s - u.border;
        if (e >= o && t <= l) {
          this.dirty = e == r || t == s ? ut : Xu, e == o && t == l && (u.contentLost || u.dom.parentNode != this.contentDOM) ? u.dirty = be : u.markDirty(e - o, t - o);
          return;
        } else
          u.dirty = u.dom == u.contentDOM && u.dom.parentNode == this.contentDOM && !u.children.length ? ut : be;
      }
      r = s;
    }
    this.dirty = ut;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? ut : Xu;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
  get ignoreForSelection() {
    return !1;
  }
  isText(e) {
    return !1;
  }
}
class nl extends In {
  constructor(e, t, r, i) {
    let u, s = t.type.toDOM;
    if (typeof s == "function" && (s = s(r, () => {
      if (!u)
        return i;
      if (u.parent)
        return u.parent.posBeforeChild(u);
    })), !t.type.spec.raw) {
      if (s.nodeType != 1) {
        let o = document.createElement("span");
        o.appendChild(s), s = o;
      }
      s.contentEditable = "false", s.classList.add("ProseMirror-widget");
    }
    super(e, [], s, null), this.widget = t, this.widget = t, u = this;
  }
  matchesWidget(e) {
    return this.dirty == pe && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get ignoreForSelection() {
    return !!this.widget.type.spec.relaxedSide;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Zf extends In {
  constructor(e, t, r, i) {
    super(e, [], t, null), this.textDOM = r, this.text = i;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class Ke extends In {
  constructor(e, t, r, i, u) {
    super(e, [], r, i), this.mark = t, this.spec = u;
  }
  static create(e, t, r, i) {
    let u = i.nodeViews[t.type.name], s = u && u(t, i, r);
    return (!s || !s.dom) && (s = Pt.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new Ke(e, t, s.dom, s.contentDOM || s.dom, s);
  }
  parseRule() {
    return this.dirty & be || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != be && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != pe) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = pe;
    }
  }
  slice(e, t, r) {
    let i = Ke.create(this.parent, this.mark, !0, r), u = this.children, s = this.size;
    t < s && (u = ki(u, t, s, r)), e > 0 && (u = ki(u, 0, e, r));
    for (let o = 0; o < u.length; o++)
      u[o].parent = i;
    return i.children = u, i;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
}
class Ze extends In {
  constructor(e, t, r, i, u, s, o) {
    super(e, [], u, s), this.node = t, this.outerDeco = r, this.innerDeco = i, this.nodeDOM = o;
  }
  // By default, a node is rendered using the `toDOM` method from the
  // node type spec. But client code can use the `nodeViews` spec to
  // supply a custom node view, which can influence various aspects of
  // the way the node works.
  //
  // (Using subclassing for this was intentionally decided against,
  // since it'd require exposing a whole slew of finicky
  // implementation details to the user code that they probably will
  // never need.)
  static create(e, t, r, i, u, s) {
    let o = u.nodeViews[t.type.name], l, a = o && o(t, u, () => {
      if (!l)
        return s;
      if (l.parent)
        return l.parent.posBeforeChild(l);
    }, r, i), c = a && a.dom, f = a && a.contentDOM;
    if (t.isText) {
      if (!c)
        c = document.createTextNode(t.text);
      else if (c.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else c || ({ dom: c, contentDOM: f } = Pt.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !f && !t.isText && c.nodeName != "BR" && (c.hasAttribute("contenteditable") || (c.contentEditable = "false"), t.type.spec.draggable && (c.draggable = !0));
    let d = c;
    return c = sl(c, r, t), a ? l = new Gf(e, t, r, i, c, f || null, d, a) : t.isText ? new _r(e, t, r, i, c, d) : new Ze(e, t, r, i, c, f || null, d);
  }
  parseRule() {
    if (this.node.type.spec.reparseInView)
      return null;
    let e = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM)
      e.getContent = () => this.node.content;
    else if (!this.contentLost)
      e.contentElement = this.contentDOM;
    else {
      for (let t = this.children.length - 1; t >= 0; t--) {
        let r = this.children[t];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => k.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == pe && e.eq(this.node) && fr(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  // Syncs `this.children` to match `this.node.content` and the local
  // decorations, possibly introducing nesting for marks. Then, in a
  // separate step, syncs the DOM inside `this.contentDOM` to
  // `this.children`.
  updateChildren(e, t) {
    let r = this.node.inlineContent, i = t, u = e.composing ? this.localCompositionInfo(e, t) : null, s = u && u.pos > -1 ? u : null, o = u && u.pos < 0, l = new Xf(this, s && s.node, e);
    t0(this.node, this.innerDeco, (a, c, f) => {
      a.spec.marks ? l.syncToMarks(a.spec.marks, r, e, c) : a.type.side >= 0 && !f && l.syncToMarks(c == this.node.childCount ? N.none : this.node.child(c).marks, r, e, c), l.placeWidget(a, e, i);
    }, (a, c, f, d) => {
      l.syncToMarks(a.marks, r, e, d);
      let p;
      l.findNodeMatch(a, c, f, d) || o && e.state.selection.from > i && e.state.selection.to < i + a.nodeSize && (p = l.findIndexWithChild(u.node)) > -1 && l.updateNodeAt(a, c, f, p, e) || l.updateNextNode(a, c, f, e, d, i) || l.addNode(a, c, f, e, i), i += a.nodeSize;
    }), l.syncToMarks([], r, e, 0), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == ut) && (s && this.protectLocalComposition(e, s), il(this.contentDOM, this.children, e), Rt && n0(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof I) || r < t || i > t + this.node.content.size)
      return null;
    let u = e.input.compositionNode;
    if (!u || !this.dom.contains(u.parentNode))
      return null;
    if (this.node.inlineContent) {
      let s = u.nodeValue, o = r0(this.node.content, s, r - t, i - t);
      return o < 0 ? null : { node: u, pos: o, text: s };
    } else
      return { node: u, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: i }) {
    if (this.getDesc(t))
      return;
    let u = t;
    for (; u.parentNode != this.contentDOM; u = u.parentNode) {
      for (; u.previousSibling; )
        u.parentNode.removeChild(u.previousSibling);
      for (; u.nextSibling; )
        u.parentNode.removeChild(u.nextSibling);
      u.pmViewDesc && (u.pmViewDesc = void 0);
    }
    let s = new Zf(this, u, t, i);
    e.input.compositionNodes.push(s), this.children = ki(this.children, r, r + i.length, e, s);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == be || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = pe;
  }
  updateOuterDeco(e) {
    if (fr(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = ul(this.dom, this.nodeDOM, yi(this.outerDeco, this.node, t), yi(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  // Mark this node as being the selected node.
  selectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
  }
  // Remove selected node marking from this node.
  deselectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function Qu(n, e, t, r, i) {
  sl(r, e, n);
  let u = new Ze(void 0, n, e, t, r, r, r);
  return u.contentDOM && u.updateChildren(i, 0), u;
}
class _r extends Ze {
  constructor(e, t, r, i, u, s) {
    super(e, t, r, i, u, null, s);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == be || this.dirty != pe && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != pe || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = pe, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let i = this.node.cut(e, t), u = document.createTextNode(i.text);
    return new _r(this.parent, i, this.outerDeco, this.innerDeco, u, u);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = be);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class rl extends In {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == pe && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Gf extends Ze {
  constructor(e, t, r, i, u, s, o, l) {
    super(e, t, r, i, u, s, o), this.spec = l;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == be)
      return !1;
    if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
      let u = this.spec.update(e, t, r);
      return u && this.updateInner(e, t, r, i), u;
    } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, i);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, i) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r.root) : super.setSelection(e, t, r, i);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function il(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let u = 0; u < e.length; u++) {
    let s = e[u], o = s.dom;
    if (o.parentNode == n) {
      for (; o != r; )
        r = es(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(o, r);
    if (s instanceof Ke) {
      let l = r ? r.previousSibling : n.lastChild;
      il(s.contentDOM, s.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = es(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Xt = function(n) {
  n && (this.nodeName = n);
};
Xt.prototype = /* @__PURE__ */ Object.create(null);
const st = [new Xt()];
function yi(n, e, t) {
  if (n.length == 0)
    return st;
  let r = t ? st[0] : new Xt(), i = [r];
  for (let u = 0; u < n.length; u++) {
    let s = n[u].type.attrs;
    if (s) {
      s.nodeName && i.push(r = new Xt(s.nodeName));
      for (let o in s) {
        let l = s[o];
        l != null && (t && i.length == 1 && i.push(r = new Xt(e.isInline ? "span" : "div")), o == "class" ? r.class = (r.class ? r.class + " " : "") + l : o == "style" ? r.style = (r.style ? r.style + ";" : "") + l : o != "nodeName" && (r[o] = l));
      }
    }
  }
  return i;
}
function ul(n, e, t, r) {
  if (t == st && r == st)
    return e;
  let i = e;
  for (let u = 0; u < r.length; u++) {
    let s = r[u], o = t[u];
    if (u) {
      let l;
      o && o.nodeName == s.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == s.nodeName || (l = document.createElement(s.nodeName), l.pmIsDeco = !0, l.appendChild(i), o = st[0]), i = l;
    }
    Yf(i, o || st[0], s);
  }
  return i;
}
function Yf(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], i = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let u = 0; u < r.length; u++)
      i.indexOf(r[u]) == -1 && n.classList.remove(r[u]);
    for (let u = 0; u < i.length; u++)
      r.indexOf(i[u]) == -1 && n.classList.add(i[u]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, i;
      for (; i = r.exec(e.style); )
        n.style.removeProperty(i[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function sl(n, e, t) {
  return ul(n, n, st, yi(e, t, n.nodeType != 1));
}
function fr(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function es(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Xf {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Qf(e.node.content, e);
  }
  // Destroy and remove the children between the given indices in
  // `this.top`.
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  // Destroy all remaining children in `this.top`.
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  syncToMarks(e, t, r, i) {
    let u = 0, s = this.stack.length >> 1, o = Math.min(s, e.length);
    for (; u < o && (u == s - 1 ? this.top : this.stack[u + 1 << 1]).matchesMark(e[u]) && e[u].type.spec.spanning !== !1; )
      u++;
    for (; u < s; )
      this.destroyRest(), this.top.dirty = pe, this.index = this.stack.pop(), this.top = this.stack.pop(), s--;
    for (; s < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1, a = this.top.children.length;
      i < this.preMatch.index && (a = Math.min(this.index + 3, a));
      for (let c = this.index; c < a; c++) {
        let f = this.top.children[c];
        if (f.matchesMark(e[s]) && !this.isLocked(f.dom)) {
          l = c;
          break;
        }
      }
      if (l < 0 && this.index < this.top.children.length) {
        let c = this.top.children[this.index];
        c instanceof Ke && c.dirty != be && c.mark.type == e[s].type && c.spec.update && !this.isLocked(c.dom) && c.spec.update(e[s]) && (c.mark = e[s], l = this.index, this.changed = !0);
      }
      if (l > -1)
        l > this.index && (this.changed = !0, this.destroyBetween(this.index, l)), this.top = this.top.children[this.index];
      else {
        let c = Ke.create(this.top, e[s], t, r);
        this.top.children.splice(this.index, 0, c), this.top = c, this.changed = !0;
      }
      this.index = 0, s++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, t, r, i) {
    let u = -1, s;
    if (i >= this.preMatch.index && (s = this.preMatch.matches[i - this.preMatch.index]).parent == this.top && s.matchesNode(e, t, r))
      u = this.top.children.indexOf(s, this.index);
    else
      for (let o = this.index, l = Math.min(this.top.children.length, o + 5); o < l; o++) {
        let a = this.top.children[o];
        if (a.matchesNode(e, t, r) && !this.preMatch.matched.has(a)) {
          u = o;
          break;
        }
      }
    return u < 0 ? !1 : (this.destroyBetween(this.index, u), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, u) {
    let s = this.top.children[i];
    return s.dirty == be && s.dom == s.contentDOM && (s.dirty = ut), s.update(e, t, r, u) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let i = this.index; i < this.top.children.length; i++)
            if (this.top.children[i] == r)
              return i;
        }
        return -1;
      }
      e = t;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, t, r, i, u, s) {
    for (let o = this.index; o < this.top.children.length; o++) {
      let l = this.top.children[o];
      if (l instanceof Ze) {
        let a = this.preMatch.matched.get(l);
        if (a != null && a != u)
          return !1;
        let c = l.dom, f, d = this.isLocked(c) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != be && fr(t, l.outerDeco));
        if (!d && l.update(e, t, r, i))
          return this.destroyBetween(this.index, o), l.dom != c && (this.changed = !0), this.index++, !0;
        if (!d && (f = this.recreateWrapper(l, e, t, r, i, s)))
          return this.destroyBetween(this.index, o), this.top.children[this.index] = f, f.contentDOM && (f.dirty = ut, f.updateChildren(i, s + 1), f.dirty = pe), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, u, s) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !fr(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let o = Ze.create(this.top, t, r, i, u, s);
    if (o.contentDOM) {
      o.children = e.children, e.children = [];
      for (let l of o.children)
        l.parent = o;
    }
    return e.destroy(), o;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, u) {
    let s = Ze.create(this.top, e, t, r, i, u);
    s.contentDOM && s.updateChildren(i, u + 1), this.top.children.splice(this.index++, 0, s), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let u = new nl(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, u), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Ke; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof _r) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((X || j) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new rl(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function Qf(n, e) {
  let t = e, r = t.children.length, i = n.childCount, u = /* @__PURE__ */ new Map(), s = [];
  e: for (; i > 0; ) {
    let o;
    for (; ; )
      if (r) {
        let a = t.children[r - 1];
        if (a instanceof Ke)
          t = a, r = a.children.length;
        else {
          o = a, r--;
          break;
        }
      } else {
        if (t == e)
          break e;
        r = t.parent.children.indexOf(t), t = t.parent;
      }
    let l = o.node;
    if (l) {
      if (l != n.child(i - 1))
        break;
      --i, u.set(o, i), s.push(o);
    }
  }
  return { index: i, matched: u, matches: s.reverse() };
}
function e0(n, e) {
  return n.type.side - e.type.side;
}
function t0(n, e, t, r) {
  let i = e.locals(n), u = 0;
  if (i.length == 0) {
    for (let a = 0; a < n.childCount; a++) {
      let c = n.child(a);
      r(c, i, e.forChild(u, c), a), u += c.nodeSize;
    }
    return;
  }
  let s = 0, o = [], l = null;
  for (let a = 0; ; ) {
    let c, f;
    for (; s < i.length && i[s].to == u; ) {
      let g = i[s++];
      g.widget && (c ? (f || (f = [c])).push(g) : c = g);
    }
    if (c)
      if (f) {
        f.sort(e0);
        for (let g = 0; g < f.length; g++)
          t(f[g], a, !!l);
      } else
        t(c, a, !!l);
    let d, p;
    if (l)
      p = -1, d = l, l = null;
    else if (a < n.childCount)
      p = a, d = n.child(a++);
    else
      break;
    for (let g = 0; g < o.length; g++)
      o[g].to <= u && o.splice(g--, 1);
    for (; s < i.length && i[s].from <= u && i[s].to > u; )
      o.push(i[s++]);
    let h = u + d.nodeSize;
    if (d.isText) {
      let g = h;
      s < i.length && i[s].from < g && (g = i[s].from);
      for (let b = 0; b < o.length; b++)
        o[b].to < g && (g = o[b].to);
      g < h && (l = d.cut(g - u), d = d.cut(0, g - u), h = g, p = -1);
    } else
      for (; s < i.length && i[s].to < h; )
        s++;
    let m = d.isInline && !d.isLeaf ? o.filter((g) => !g.inline) : o.slice();
    r(d, m, e.forChild(u, d), p), u = h;
  }
}
function n0(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function r0(n, e, t, r) {
  for (let i = 0, u = 0; i < n.childCount && u <= r; ) {
    let s = n.child(i++), o = u;
    if (u += s.nodeSize, !s.isText)
      continue;
    let l = s.text;
    for (; i < n.childCount; ) {
      let a = n.child(i++);
      if (u += a.nodeSize, !a.isText)
        break;
      l += a.text;
    }
    if (u >= t) {
      if (u >= r && l.slice(r - e.length - o, r - o) == e)
        return r - e.length;
      let a = o < r ? l.lastIndexOf(e, r - o - 1) : -1;
      if (a >= 0 && a + e.length + o >= t)
        return o + a;
      if (t == r && l.length >= r + e.length - o && l.slice(r - o, r - o + e.length) == e)
        return r;
    }
  }
  return -1;
}
function ki(n, e, t, r, i) {
  let u = [];
  for (let s = 0, o = 0; s < n.length; s++) {
    let l = n[s], a = o, c = o += l.size;
    a >= t || c <= e ? u.push(l) : (a < e && u.push(l.slice(0, e - a, r)), i && (u.push(i), i = void 0), c > t && u.push(l.slice(t - a, l.size, r)));
  }
  return u;
}
function Ki(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), u = i && i.size == 0, s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0)
    return null;
  let o = r.resolve(s), l, a;
  if (Er(t)) {
    for (l = s; i && !i.node; )
      i = i.parent;
    let f = i.node;
    if (i && f.isAtom && T.isSelectable(f) && i.parent && !(f.isInline && Of(t.focusNode, t.focusOffset, i.dom))) {
      let d = i.posBefore;
      a = new T(s == d ? o : r.resolve(d));
    }
  } else {
    if (t instanceof n.dom.ownerDocument.defaultView.Selection && t.rangeCount > 1) {
      let f = s, d = s;
      for (let p = 0; p < t.rangeCount; p++) {
        let h = t.getRangeAt(p);
        f = Math.min(f, n.docView.posFromDOM(h.startContainer, h.startOffset, 1)), d = Math.max(d, n.docView.posFromDOM(h.endContainer, h.endOffset, -1));
      }
      if (f < 0)
        return null;
      [l, s] = d == n.state.selection.anchor ? [d, f] : [f, d], o = r.resolve(s);
    } else
      l = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (l < 0)
      return null;
  }
  let c = r.resolve(l);
  if (!a) {
    let f = e == "pointer" || n.state.selection.head < o.pos && !u ? 1 : -1;
    a = Zi(n, c, o, f);
  }
  return a;
}
function ol(n) {
  return n.editable ? n.hasFocus() : al(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Re(n, e = !1) {
  let t = n.state.selection;
  if (ll(n, t), !ol(n))
    return;
  let r = n.input.mouseDown;
  if (!e && j && r) {
    let i = n.domSelectionRange(), u = n.domObserver.currentSelection;
    if (i.anchorNode && u.anchorNode && bt(i.anchorNode, i.anchorOffset, u.anchorNode, u.anchorOffset) && r.delaySelUpdate()) {
      n.domObserver.setCurSelection();
      return;
    }
  }
  if (n.domObserver.disconnectSelection(), n.cursorWrapper)
    u0(n);
  else {
    let { anchor: i, head: u } = t, s, o;
    ts && !(t instanceof I) && (t.$from.parent.inlineContent || (s = ns(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = ns(n, t.to))), n.docView.setSelection(i, u, n, e), ts && (s && rs(s), o && rs(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && i0(n));
  }
  n.domObserver.setCurSelection(), n.domObserver.connectSelection();
}
const ts = X || j && Ko < 63;
function ns(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, u = r ? t.childNodes[r - 1] : null;
  if (X && i && i.contentEditable == "false")
    return Zr(i);
  if ((!i || i.contentEditable == "false") && (!u || u.contentEditable == "false")) {
    if (i)
      return Zr(i);
    if (u)
      return Zr(u);
  }
}
function Zr(n) {
  return n.contentEditable = "true", X && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function rs(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function i0(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!ol(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function u0(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, G(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && re && Je <= 11 && (t.disabled = !0, t.disabled = !1);
}
function ll(n, e) {
  if (e instanceof T) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (is(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    is(n);
}
function is(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Zi(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || I.between(e, t, r);
}
function us(n) {
  return n.editable && !n.hasFocus() ? !1 : al(n);
}
function al(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function s0(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return bt(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Ci(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), u = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return u && R.findFrom(u, e);
}
function Pe(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function ss(n, e, t) {
  let r = n.state.selection;
  if (r instanceof I)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, u = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!u || u.isText || !u.isLeaf)
        return !1;
      let s = n.state.doc.resolve(i.pos + u.nodeSize * (e < 0 ? -1 : 1));
      return Pe(n, new I(r.$anchor, s));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Ci(n.state, e);
        return i && i instanceof T ? Pe(n, i) : !1;
      } else if (!(ce && t.indexOf("m") > -1)) {
        let i = r.$head, u = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, s;
        if (!u || u.isText)
          return !1;
        let o = e < 0 ? i.pos - u.nodeSize : i.pos;
        return u.isAtom || (s = n.docView.descAt(o)) && !s.contentDOM ? T.isSelectable(u) ? Pe(n, new T(e < 0 ? n.state.doc.resolve(i.pos - u.nodeSize) : i)) : vn ? Pe(n, new I(n.state.doc.resolve(e < 0 ? o : o + u.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof T && r.node.isInline)
      return Pe(n, new I(e > 0 ? r.$to : r.$from));
    {
      let i = Ci(n.state, e);
      return i ? Pe(n, i) : !1;
    }
  }
}
function hr(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Qt(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function kt(n, e) {
  return e < 0 ? o0(n) : l0(n);
}
function o0(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, u, s = !1;
  for (de && t.nodeType == 1 && r < hr(t) && Qt(t.childNodes[r], -1) && (s = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let o = t.childNodes[r - 1];
        if (Qt(o, -1))
          i = t, u = --r;
        else if (o.nodeType == 3)
          t = o, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (cl(t))
        break;
      {
        let o = t.previousSibling;
        for (; o && Qt(o, -1); )
          i = t.parentNode, u = G(o), o = o.previousSibling;
        if (o)
          t = o, r = hr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  s ? Di(n, t, r) : i && Di(n, i, u);
}
function l0(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = hr(t), u, s;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let o = t.childNodes[r];
      if (Qt(o, 1))
        u = t, s = ++r;
      else
        break;
    } else {
      if (cl(t))
        break;
      {
        let o = t.nextSibling;
        for (; o && Qt(o, 1); )
          u = o.parentNode, s = G(o) + 1, o = o.nextSibling;
        if (o)
          t = o, r = 0, i = hr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  u && Di(n, u, s);
}
function cl(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function a0(n, e) {
  for (; n && e == n.childNodes.length && !Fn(n); )
    e = G(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function c0(n, e) {
  for (; n && !e && !Fn(n); )
    e = G(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Di(n, e, t) {
  if (e.nodeType != 3) {
    let u, s;
    (s = a0(e, t)) ? (e = s, t = 0) : (u = c0(e, t)) && (e = u, t = u.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (Er(r)) {
    let u = document.createRange();
    u.setEnd(e, t), u.setStart(e, t), r.removeAllRanges(), r.addRange(u);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && Re(n);
  }, 50);
}
function ls(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(j || Zo) && t.parent.inlineContent) {
    let i = n.coordsAtPos(e);
    if (e > t.start()) {
      let u = n.coordsAtPos(e - 1), s = (u.top + u.bottom) / 2;
      if (s > i.top && s < i.bottom && Math.abs(u.left - i.left) > 1)
        return u.left < i.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let u = n.coordsAtPos(e + 1), s = (u.top + u.bottom) / 2;
      if (s > i.top && s < i.bottom && Math.abs(u.left - i.left) > 1)
        return u.left > i.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function as(n, e, t) {
  let r = n.state.selection;
  if (r instanceof I && !r.empty || t.indexOf("s") > -1 || ce && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: u } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = Ci(n.state, e);
    if (s && s instanceof T)
      return Pe(n, s);
  }
  if (!i.parent.inlineContent) {
    let s = e < 0 ? i : u, o = r instanceof oe ? R.near(s, e) : R.findFrom(s, e);
    return o ? Pe(n, o) : !1;
  }
  return !1;
}
function cs(n, e) {
  if (!(n.state.selection instanceof I))
    return !0;
  let { $head: t, $anchor: r, empty: i } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!i)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let u = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (u && !u.isText) {
    let s = n.state.tr;
    return e < 0 ? s.delete(t.pos - u.nodeSize, t.pos) : s.delete(t.pos, t.pos + u.nodeSize), n.dispatch(s), !0;
  }
  return !1;
}
function fs(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function f0(n) {
  if (!X || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    fs(n, r, "true"), setTimeout(() => fs(n, r, "false"), 20);
  }
  return !1;
}
function h0(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function d0(n, e) {
  let t = e.keyCode, r = h0(e);
  if (t == 8 || ce && t == 72 && r == "c")
    return cs(n, -1) || kt(n, -1);
  if (t == 46 && !e.shiftKey || ce && t == 68 && r == "c")
    return cs(n, 1) || kt(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || ce && t == 66 && r == "c") {
    let i = t == 37 ? ls(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return ss(n, i, r) || kt(n, i);
  } else if (t == 39 || ce && t == 70 && r == "c") {
    let i = t == 39 ? ls(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return ss(n, i, r) || kt(n, i);
  } else {
    if (t == 38 || ce && t == 80 && r == "c")
      return as(n, -1, r) || kt(n, -1);
    if (t == 40 || ce && t == 78 && r == "c")
      return f0(n) || as(n, 1, r) || kt(n, 1);
    if (r == (ce ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Gi(n, e) {
  n.someProp("transformCopied", (p) => {
    e = p(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: u } = e;
  for (; i > 1 && u > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, u--;
    let p = r.firstChild;
    t.push(p.type.name, p.attrs != p.type.defaultAttrs ? p.attrs : null), r = p.content;
  }
  let s = n.someProp("clipboardSerializer") || Pt.fromSchema(n.state.schema), o = gl(), l = o.createElement("div");
  l.appendChild(s.serializeFragment(r, { document: o }));
  let a = l.firstChild, c, f = 0;
  for (; a && a.nodeType == 1 && (c = ml[a.nodeName.toLowerCase()]); ) {
    for (let p = c.length - 1; p >= 0; p--) {
      let h = o.createElement(c[p]);
      for (; l.firstChild; )
        h.appendChild(l.firstChild);
      l.appendChild(h), f++;
    }
    a = l.firstChild;
  }
  a && a.nodeType == 1 && a.setAttribute("data-pm-slice", `${i} ${u}${f ? ` -${f}` : ""} ${JSON.stringify(t)}`);
  let d = n.someProp("clipboardTextSerializer", (p) => p(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: l, text: d, slice: e };
}
function fl(n, e, t, r, i) {
  let u = i.parent.type.spec.code, s, o;
  if (!t && !e)
    return null;
  let l = !!e && (r || u || !t);
  if (l) {
    if (n.someProp("transformPastedText", (d) => {
      e = d(e, u || r, n);
    }), u)
      return o = new E(k.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (d) => {
        o = d(o, n, !0);
      }), o;
    let f = n.someProp("clipboardTextParser", (d) => d(e, i, r, n));
    if (f)
      o = f;
    else {
      let d = i.marks(), { schema: p } = n.state, h = Pt.fromSchema(p);
      s = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = s.appendChild(document.createElement("p"));
        m && g.appendChild(h.serializeNode(p.text(m, d)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (f) => {
      t = f(t, n);
    }), s = b0(t), vn && x0(s);
  let a = s && s.querySelector("[data-pm-slice]"), c = a && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(a.getAttribute("data-pm-slice") || "");
  if (c && c[3])
    for (let f = +c[3]; f > 0; f--) {
      let d = s.firstChild;
      for (; d && d.nodeType != 1; )
        d = d.nextSibling;
      if (!d)
        break;
      s = d;
    }
  if (o || (o = (n.someProp("clipboardParser") || n.someProp("domParser") || on.fromSchema(n.state.schema)).parseSlice(s, {
    preserveWhitespace: !!(l || c),
    context: i,
    ruleFromNode(d) {
      return d.nodeName == "BR" && !d.nextSibling && d.parentNode && !p0.test(d.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), c)
    o = y0(hs(o, +c[1], +c[2]), c[4]);
  else if (o = E.maxOpen(m0(o.content, i), !0), o.openStart || o.openEnd) {
    let f = 0, d = 0;
    for (let p = o.content.firstChild; f < o.openStart && !p.type.spec.isolating; f++, p = p.firstChild)
      ;
    for (let p = o.content.lastChild; d < o.openEnd && !p.type.spec.isolating; d++, p = p.lastChild)
      ;
    o = hs(o, f, d);
  }
  return n.someProp("transformPasted", (f) => {
    o = f(o, n, l);
  }), o;
}
const p0 = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function m0(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)), u, s = [];
    if (n.forEach((o) => {
      if (!s)
        return;
      let l = i.findWrapping(o.type), a;
      if (!l)
        return s = null;
      if (a = s.length && u.length && dl(l, u, o, s[s.length - 1], 0))
        s[s.length - 1] = a;
      else {
        s.length && (s[s.length - 1] = pl(s[s.length - 1], u.length));
        let c = hl(o, l);
        s.push(c), i = i.matchType(c.type), u = l;
      }
    }), s)
      return k.from(s);
  }
  return n;
}
function hl(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, k.from(n));
  return n;
}
function dl(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let u = dl(n, e, t, r.lastChild, i + 1);
    if (u)
      return r.copy(r.content.replaceChild(r.childCount - 1, u));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(k.from(hl(t, n, i + 1))));
  }
}
function pl(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, pl(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(k.empty, !0);
  return n.copy(t.append(r));
}
function Si(n, e, t, r, i, u) {
  let s = e < 0 ? n.firstChild : n.lastChild, o = s.content;
  return n.childCount > 1 && (u = 0), i < r - 1 && (o = Si(o, e, t, r, i + 1, u)), i >= t && (o = e < 0 ? s.contentMatchAt(0).fillBefore(o, u <= i).append(o) : o.append(s.contentMatchAt(s.childCount).fillBefore(k.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(o));
}
function hs(n, e, t) {
  return e < n.openStart && (n = new E(Si(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new E(Si(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const ml = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
function gl() {
  return document.implementation.createHTMLDocument("title");
}
let Gr = null;
function g0(n) {
  let e = window.trustedTypes;
  return e ? (Gr || (Gr = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), Gr.createHTML(n)) : n;
}
function b0(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = gl(), r = t.body, i = /<([a-z][^>\s]+)/i.exec(n), u;
  if ((u = i && ml[i[1].toLowerCase()]) && (n = u.map((s) => "<" + s + ">").join("") + n + u.map((s) => "</" + s + ">").reverse().join("")), r.innerHTML = g0(n), u)
    for (let s = 0; s < u.length; s++)
      r = r.querySelector(u[s]) || r;
  for (let s = 0; s < t.styleSheets.length; s++) {
    let o = t.styleSheets[s];
    for (let l = 0; l < o.rules.length; l++) {
      let a = o.rules[l];
      if (a instanceof CSSStyleRule) {
        let c = r.querySelectorAll(a.selectorText);
        for (let f = 0; f < c.length; f++)
          c[f].style.cssText += a.style.cssText;
      }
    }
  }
  return r;
}
function x0(n) {
  let e = n.querySelectorAll(j ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function y0(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: u, openEnd: s } = n;
  for (let o = r.length - 2; o >= 0; o -= 2) {
    let l = t.nodes[r[o]];
    if (!l || l.hasRequiredAttrs())
      break;
    i = k.from(l.create(r[o + 1], i)), u++, s++;
  }
  return new E(i, u, s);
}
const te = {}, ne = {}, k0 = { touchstart: !0, touchmove: !0 };
class C0 {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function D0(n) {
  for (let e in te) {
    let t = te[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      E0(n, r) && !Yi(n, r) && (n.editable || !(r.type in ne)) && t(n, r);
    }, k0[e] ? { passive: !0 } : void 0);
  }
  X && n.dom.addEventListener("input", () => null), Ei(n);
}
function Ie(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function S0(n) {
  n.input.mouseDown && n.input.mouseDown.done(), n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Ei(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => Yi(n, r));
  });
}
function Yi(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function E0(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function _0(n, e) {
  !Yi(n, e) && te[e.type] && (n.editable || !(e.type in ne)) && te[e.type](n, e);
}
ne.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !kl(n) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(ve && j && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), Rt && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, rt(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || d0(n, t) ? t.preventDefault() : Ie(n, "key");
};
ne.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
ne.keypress = (n, e) => {
  let t = e;
  if (kl(n) || !t.charCode || t.ctrlKey && !t.altKey || ce && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof I) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode), u = () => n.state.tr.insertText(i).scrollIntoView();
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (s) => s(n, r.$from.pos, r.$to.pos, i, u)) && n.dispatch(u()), t.preventDefault();
  }
};
function Rn(n) {
  return { left: n.clientX, top: n.clientY };
}
function w0(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function Xi(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let u = n.state.doc.resolve(r);
  for (let s = u.depth + 1; s > 0; s--)
    if (n.someProp(e, (o) => s > u.depth ? o(n, t, u.nodeAfter, u.before(s), i, !0) : o(n, t, u.node(s), u.before(s), i, !1)))
      return !0;
  return !1;
}
function Bn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function A0(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && T.isSelectable(r) ? (Bn(n, new T(t)), !0) : !1;
}
function M0(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof T && (r = t.node);
  let u = n.state.doc.resolve(e);
  for (let s = u.depth + 1; s > 0; s--) {
    let o = s > u.depth ? u.nodeAfter : u.node(s);
    if (T.isSelectable(o)) {
      r && t.$from.depth > 0 && s >= t.$from.depth && u.before(t.$from.depth + 1) == t.$from.pos ? i = u.before(t.$from.depth) : i = u.before(s);
      break;
    }
  }
  return i != null ? (Bn(n, T.create(n.state.doc, i)), !0) : !1;
}
function T0(n, e, t, r, i) {
  return Xi(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (u) => u(n, e, r)) || (i ? M0(n, t) : A0(n, t));
}
function O0(n, e, t, r) {
  return Xi(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function N0(n, e, t, r) {
  return Xi(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || F0(n, t, r);
}
function F0(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = bl(n, e, !0), i = n.state.doc;
  return r ? (Bn(n, r), r instanceof I && i.eq(n.state.doc) && (n.input.mouseDown = new I0(n, r)), !0) : !1;
}
function bl(n, e, t) {
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? I.create(r, 0, r.content.size) : null;
  let i = r.resolve(e);
  for (let u = i.depth + 1; u > 0; u--) {
    let s = u > i.depth ? i.nodeAfter : i.node(u), o = i.before(u);
    if (s.inlineContent)
      return I.create(r, o + 1, o + 1 + s.content.size);
    if (t && T.isSelectable(s))
      return T.create(r, o);
  }
  return null;
}
function Qi(n) {
  return dr(n);
}
const xl = ce ? "metaKey" : "ctrlKey";
te.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Qi(n), i = Date.now(), u = "singleClick";
  i - n.input.lastClick.time < 500 && w0(t, n.input.lastClick) && !t[xl] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? u = "doubleClick" : n.input.lastClick.type == "doubleClick" && (u = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: u, button: t.button }, n.input.mouseDown && n.input.mouseDown.done();
  let s = n.posAtCoords(Rn(t));
  s && (u == "singleClick" ? n.input.mouseDown = new v0(n, s, t, !!r) : (u == "doubleClick" ? O0 : N0)(n, s.pos, s.inside, t) ? t.preventDefault() : Ie(n, "pointer"));
};
class yl {
  constructor(e) {
    this.view = e, this.mightDrag = null, e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this));
  }
  up(e) {
    this.done();
  }
  move(e) {
    e.buttons == 0 && this.done();
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.view.input.mouseDown == this && (this.view.input.mouseDown = null);
  }
  delaySelUpdate() {
    return !1;
  }
}
class v0 extends yl {
  constructor(e, t, r, i) {
    super(e), this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!r[xl], this.allowDefault = r.shiftKey;
    let u, s;
    if (t.inside > -1)
      u = e.state.doc.nodeAt(t.inside), s = t.inside;
    else {
      let c = e.state.doc.resolve(t.pos);
      u = c.parent, s = c.depth ? c.before() : 0;
    }
    const o = i ? null : r.target, l = o ? e.docView.nearestDesc(o, !0) : null;
    this.target = l && l.nodeDOM.nodeType == 1 ? l.nodeDOM : null;
    let { selection: a } = e.state;
    r.button == 0 && (u.type.spec.draggable && u.type.spec.selectable !== !1 || a instanceof T && a.from <= s && a.to > s) && (this.mightDrag = {
      node: u,
      pos: s,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && de && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), Ie(e, "pointer");
  }
  done() {
    super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
      this.view.isDestroyed || Re(this.view);
    });
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Rn(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Ie(this.view, "pointer") : T0(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    X && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    j && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Bn(this.view, R.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Ie(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Ie(this.view, "pointer"), super.move(e);
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
  delaySelUpdate() {
    return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
  }
}
class I0 extends yl {
  constructor(e, t) {
    super(e), this.startSelection = t, this.startDoc = e.state.doc;
  }
  move(e) {
    if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
      this.done();
      return;
    }
    e.preventDefault(), Ie(this.view, "pointer");
    let t = this.view.posAtCoords(Rn(e)), r = t && bl(this.view, t.inside, !1);
    if (!r)
      return;
    let { doc: i } = this.view.state, u = this.startSelection, [s, o] = r.from < u.from ? [u.to, r.from] : [u.from, r.to];
    Bn(this.view, I.create(i, s, o));
  }
}
te.touchstart = (n) => {
  n.input.lastTouch = Date.now(), Qi(n), Ie(n, "pointer");
};
te.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Ie(n, "pointer");
};
te.contextmenu = (n) => Qi(n);
function kl(n, e) {
  return n.composing ? !0 : X && Math.abs(Date.now() - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const R0 = ve ? 5e3 : -1;
ne.compositionstart = ne.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof I && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || j && Zo && B0(n)))
      n.markCursor = n.state.storedMarks || t.marks(), dr(n, !0), n.markCursor = null;
    else if (dr(n, !e.selection.empty), de && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let i = r.focusNode, u = r.focusOffset; i && i.nodeType == 1 && u != 0; ) {
        let s = u < 0 ? i.lastChild : i.childNodes[u - 1];
        if (!s)
          break;
        if (s.nodeType == 3) {
          let o = n.domSelection();
          o && o.collapse(s, s.nodeValue.length);
          break;
        } else
          i = s, u = -1;
      }
    }
    n.input.composing = !0;
  }
  Cl(n, R0);
};
function B0(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
ne.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now(), n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Cl(n, 20));
};
function Cl(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => dr(n), e));
}
function Dl(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function $0(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Mf(e.focusNode, e.focusOffset), r = Tf(e.focusNode, e.focusOffset);
  if (t && r && t != r) {
    let i = r.pmViewDesc, u = n.domObserver.lastChangedTextNode;
    if (t == u || r == u)
      return u;
    if (!i || !i.isText(r.nodeValue))
      return r;
    if (n.input.compositionNode == r) {
      let s = t.pmViewDesc;
      if (!(!s || !s.isText(t.nodeValue)))
        return r;
    }
  }
  return t || r;
}
function dr(n, e = !1) {
  if (!(ve && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Dl(n), e || n.docView && n.docView.dirty) {
      let t = Ki(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function P0(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const fn = re && Je < 15 || Rt && vf < 604;
te.copy = ne.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let u = fn ? null : t.clipboardData, s = r.content(), { dom: o, text: l } = Gi(n, s);
  u ? (t.preventDefault(), u.clearData(), u.setData("text/html", o.innerHTML), u.setData("text/plain", l)) : P0(n, o), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function z0(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function L0(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? hn(n, r.value, null, i, e) : hn(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function hn(n, e, t, r, i) {
  let u = fl(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, i, u || E.empty)))
    return !0;
  if (!u)
    return !1;
  let s = z0(u), o = s ? n.state.tr.replaceSelectionWith(s, r) : n.state.tr.replaceSelection(u);
  return n.dispatch(o.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Sl(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
ne.paste = (n, e) => {
  let t = e;
  if (n.composing && !ve)
    return;
  let r = fn ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && hn(n, Sl(r), r.getData("text/html"), i, t) ? t.preventDefault() : L0(n, t);
};
class El {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const V0 = ce ? "altKey" : "ctrlKey";
function _l(n, e) {
  let t;
  return n.someProp("dragCopies", (r) => {
    t = t || r(e);
  }), t != null ? !t : !e[V0];
}
te.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, u = i.empty ? null : n.posAtCoords(Rn(t)), s;
  if (!(u && u.pos >= i.from && u.pos <= (i instanceof T ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      s = T.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let f = n.docView.nearestDesc(t.target, !0);
      f && f.node.type.spec.draggable && f != n.docView && (s = T.create(n.state.doc, f.posBefore));
    }
  }
  let o = (s || n.state.selection).content(), { dom: l, text: a, slice: c } = Gi(n, o);
  (!t.dataTransfer.files.length || !j || Ko > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(fn ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", fn || t.dataTransfer.setData("text/plain", a), n.dragging = new El(c, _l(n, t), s);
};
te.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
ne.dragover = ne.dragenter = (n, e) => e.preventDefault();
ne.drop = (n, e) => {
  try {
    q0(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function q0(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Rn(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), u = t && t.slice;
  u ? n.someProp("transformPasted", (p) => {
    u = p(u, n, !1);
  }) : u = fl(n, Sl(e.dataTransfer), fn ? null : e.dataTransfer.getData("text/html"), !1, i);
  let s = !!(t && _l(n, e));
  if (n.someProp("handleDrop", (p) => p(n, e, u || E.empty, s))) {
    e.preventDefault();
    return;
  }
  if (!u)
    return;
  e.preventDefault();
  let o = u ? Nc(n.state.doc, i.pos, u) : i.pos;
  o == null && (o = i.pos);
  let l = n.state.tr;
  if (s) {
    let { node: p } = t;
    p ? p.replace(l) : l.deleteSelection();
  }
  let a = l.mapping.map(o), c = u.openStart == 0 && u.openEnd == 0 && u.content.childCount == 1, f = l.doc;
  if (c ? l.replaceRangeWith(a, a, u.content.firstChild) : l.replaceRange(a, a, u), l.doc.eq(f))
    return;
  let d = l.doc.resolve(a);
  if (c && T.isSelectable(u.content.firstChild) && d.nodeAfter && d.nodeAfter.sameMarkup(u.content.firstChild))
    l.setSelection(new T(d));
  else {
    let p = l.mapping.map(o);
    l.mapping.maps[l.mapping.maps.length - 1].forEach((h, m, g, b) => p = b), l.setSelection(Zi(n, d, l.doc.resolve(p)));
  }
  n.focus(), n.dispatch(l.setMeta("uiEvent", "drop"));
}
te.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Re(n);
  }, 20));
};
te.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
te.beforeinput = (n, e) => {
  if (j && ve && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (u) => u(n, rt(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in ne)
  te[n] = ne[n];
function dn(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class pr {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || ht, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: u, deleted: s } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return s ? null : new he(u - r, u - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof pr && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && dn(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Ge {
  constructor(e, t) {
    this.attrs = e, this.spec = t || ht;
  }
  map(e, t, r, i) {
    let u = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, s = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return u >= s ? null : new he(u, s, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof Ge && dn(this.attrs, e.attrs) && dn(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Ge;
  }
  destroy() {
  }
}
class eu {
  constructor(e, t) {
    this.attrs = e, this.spec = t || ht;
  }
  map(e, t, r, i) {
    let u = e.mapResult(t.from + i, 1);
    if (u.deleted)
      return null;
    let s = e.mapResult(t.to + i, -1);
    return s.deleted || s.pos <= u.pos ? null : new he(u.pos - r, s.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), u;
    return i == t.from && !(u = e.child(r)).isText && i + u.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof eu && dn(this.attrs, e.attrs) && dn(this.spec, e.spec);
  }
  destroy() {
  }
}
class he {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  /**
  @internal
  */
  copy(e, t) {
    return new he(e, t, this.type);
  }
  /**
  @internal
  */
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  /**
  @internal
  */
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, t, r) {
    return new he(e, e, new pr(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new he(e, t, new Ge(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new he(e, t, new eu(r, i));
  }
  /**
  The spec provided when creating this decoration. Can be useful
  if you've stored extra information in that object.
  */
  get spec() {
    return this.type.spec;
  }
  /**
  @internal
  */
  get inline() {
    return this.type instanceof Ge;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof pr;
  }
}
const St = [], ht = {};
class L {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : St, this.children = t.length ? t : St;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? mr(t, e, 0, ht) : Y;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, t, r) {
    let i = [];
    return this.findInner(e ?? 0, t ?? 1e9, i, 0, r), i;
  }
  findInner(e, t, r, i, u) {
    for (let s = 0; s < this.local.length; s++) {
      let o = this.local[s];
      o.from <= t && o.to >= e && (!u || u(o.spec)) && r.push(o.copy(o.from + i, o.to + i));
    }
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] < t && this.children[s + 1] > e) {
        let o = this.children[s] + 1;
        this.children[s + 2].findInner(e - o, t - o, r, i + o, u);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == Y || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || ht);
  }
  /**
  @internal
  */
  mapInner(e, t, r, i, u) {
    let s;
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o].map(e, r, i);
      l && l.type.valid(t, l) ? (s || (s = [])).push(l) : u.onRemove && u.onRemove(this.local[o].spec);
    }
    return this.children.length ? H0(this.children, s || [], e, t, r, i, u) : s ? new L(s.sort(dt), St) : Y;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Y ? L.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, u = 0;
    e.forEach((o, l) => {
      let a = l + r, c;
      if (c = Al(t, o, a)) {
        for (i || (i = this.children.slice()); u < i.length && i[u] < l; )
          u += 3;
        i[u] == l ? i[u + 2] = i[u + 2].addInner(o, c, a + 1) : i.splice(u, 0, l, l + o.nodeSize, mr(c, o, a + 1, ht)), u += 3;
      }
    });
    let s = wl(u ? Ml(t) : t, -r);
    for (let o = 0; o < s.length; o++)
      s[o].type.valid(e, s[o]) || s.splice(o--, 1);
    return new L(s.length ? this.local.concat(s).sort(dt) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Y ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, i = this.local;
    for (let u = 0; u < r.length; u += 3) {
      let s, o = r[u] + t, l = r[u + 1] + t;
      for (let c = 0, f; c < e.length; c++)
        (f = e[c]) && f.from > o && f.to < l && (e[c] = null, (s || (s = [])).push(f));
      if (!s)
        continue;
      r == this.children && (r = this.children.slice());
      let a = r[u + 2].removeInner(s, o + 1);
      a != Y ? r[u + 2] = a : (r.splice(u, 3), u -= 3);
    }
    if (i.length) {
      for (let u = 0, s; u < e.length; u++)
        if (s = e[u])
          for (let o = 0; o < i.length; o++)
            i[o].eq(s, t) && (i == this.local && (i = this.local.slice()), i.splice(o--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new L(i, r) : Y;
  }
  forChild(e, t) {
    if (this == Y)
      return this;
    if (t.isLeaf)
      return L.empty;
    let r, i;
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] >= e) {
        this.children[o] == e && (r = this.children[o + 2]);
        break;
      }
    let u = e + 1, s = u + t.content.size;
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o];
      if (l.from < s && l.to > u && l.type instanceof Ge) {
        let a = Math.max(u, l.from) - u, c = Math.min(s, l.to) - u;
        a < c && (i || (i = [])).push(l.copy(a, c));
      }
    }
    if (i) {
      let o = new L(i.sort(dt), St);
      return r ? new Ve([o, r]) : o;
    }
    return r || Y;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof L) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return tu(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Y)
      return St;
    if (e.inlineContent || !this.local.some(Ge.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Ge || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
L.empty = new L([], []);
L.removeOverlap = tu;
const Y = L.empty;
class Ve {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, ht));
    return Ve.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return L.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let u = this.members[i].forChild(e, t);
      u != Y && (u instanceof Ve ? r = r.concat(u.members) : r.push(u));
    }
    return Ve.from(r);
  }
  eq(e) {
    if (!(e instanceof Ve) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let i = 0; i < this.members.length; i++) {
      let u = this.members[i].localsInner(e);
      if (u.length)
        if (!t)
          t = u;
        else {
          r && (t = t.slice(), r = !1);
          for (let s = 0; s < u.length; s++)
            t.push(u[s]);
        }
    }
    return t ? tu(r ? t : t.sort(dt)) : St;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Y;
      case 1:
        return e[0];
      default:
        return new Ve(e.every((t) => t instanceof L) ? e : e.reduce((t, r) => t.concat(r instanceof L ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function H0(n, e, t, r, i, u, s) {
  let o = n.slice();
  for (let a = 0, c = u; a < t.maps.length; a++) {
    let f = 0;
    t.maps[a].forEach((d, p, h, m) => {
      let g = m - h - (p - d);
      for (let b = 0; b < o.length; b += 3) {
        let C = o[b + 1];
        if (C < 0 || d > C + c - f)
          continue;
        let D = o[b] + c - f;
        p >= D ? o[b + 1] = d <= D ? -2 : -1 : d >= c && g && (o[b] += g, o[b + 1] += g);
      }
      f += g;
    }), c = t.maps[a].map(c, -1);
  }
  let l = !1;
  for (let a = 0; a < o.length; a += 3)
    if (o[a + 1] < 0) {
      if (o[a + 1] == -2) {
        l = !0, o[a + 1] = -1;
        continue;
      }
      let c = t.map(n[a] + u), f = c - i;
      if (f < 0 || f >= r.content.size) {
        l = !0;
        continue;
      }
      let d = t.map(n[a + 1] + u, -1), p = d - i, { index: h, offset: m } = r.content.findIndex(f), g = r.maybeChild(h);
      if (g && m == f && m + g.nodeSize == p) {
        let b = o[a + 2].mapInner(t, g, c + 1, n[a] + u + 1, s);
        b != Y ? (o[a] = f, o[a + 1] = p, o[a + 2] = b) : (o[a + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let a = U0(o, n, e, t, i, u, s), c = mr(a, r, 0, s);
    e = c.local;
    for (let f = 0; f < o.length; f += 3)
      o[f + 1] < 0 && (o.splice(f, 3), f -= 3);
    for (let f = 0, d = 0; f < c.children.length; f += 3) {
      let p = c.children[f];
      for (; d < o.length && o[d] < p; )
        d += 3;
      o.splice(d, 0, c.children[f], c.children[f + 1], c.children[f + 2]);
    }
  }
  return new L(e.sort(dt), o);
}
function wl(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new he(i.from + e, i.to + e, i.type));
  }
  return t;
}
function U0(n, e, t, r, i, u, s) {
  function o(l, a) {
    for (let c = 0; c < l.local.length; c++) {
      let f = l.local[c].map(r, i, a);
      f ? t.push(f) : s.onRemove && s.onRemove(l.local[c].spec);
    }
    for (let c = 0; c < l.children.length; c += 3)
      o(l.children[c + 2], l.children[c] + a + 1);
  }
  for (let l = 0; l < n.length; l += 3)
    n[l + 1] == -1 && o(n[l + 2], e[l] + u + 1);
  return t;
}
function Al(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let u = 0, s; u < n.length; u++)
    (s = n[u]) && s.from > t && s.to < r && ((i || (i = [])).push(s), n[u] = null);
  return i;
}
function Ml(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function mr(n, e, t, r) {
  let i = [], u = !1;
  e.forEach((o, l) => {
    let a = Al(n, o, l + t);
    if (a) {
      u = !0;
      let c = mr(a, o, t + l + 1, r);
      c != Y && i.push(l, l + o.nodeSize, c);
    }
  });
  let s = wl(u ? Ml(n) : n, -t).sort(dt);
  for (let o = 0; o < s.length; o++)
    s[o].type.valid(e, s[o]) || (r.onRemove && r.onRemove(s[o].spec), s.splice(o--, 1));
  return s.length || i.length ? new L(s, i) : Y;
}
function dt(n, e) {
  return n.from - e.from || n.to - e.to;
}
function tu(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let u = e[i];
        if (u.from == r.from) {
          u.to != r.to && (e == n && (e = n.slice()), e[i] = u.copy(u.from, r.to), ds(e, i + 1, u.copy(r.to, u.to)));
          continue;
        } else {
          u.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, u.from), ds(e, i, r.copy(u.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ds(n, e, t) {
  for (; e < n.length && dt(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Yr(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Y && e.push(r);
  }), n.cursorWrapper && e.push(L.create(n.state.doc, [n.cursorWrapper.deco])), Ve.from(e);
}
const W0 = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, j0 = re && Je <= 11;
class J0 {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class K0 {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new J0(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      re && Je <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : X && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), j0 && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, W0)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (us(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Re(this.view);
      if (re && Je <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && bt(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode)
      return !0;
    let t = /* @__PURE__ */ new Set(), r;
    for (let u = e.focusNode; u; u = It(u))
      t.add(u);
    for (let u = e.anchorNode; u; u = It(u))
      if (t.has(u)) {
        r = u;
        break;
      }
    let i = r && this.view.docView.nearestDesc(r);
    if (i && i.ignoreMutation({
      type: "selection",
      target: r.nodeType == 3 ? r.parentNode : r
    }))
      return this.setCurSelection(), !0;
  }
  pendingRecords() {
    if (this.observer)
      for (let e of this.observer.takeRecords())
        this.queue.push(e);
    return this.queue;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1)
      return;
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && us(e) && !this.ignoreSelectionChange(r), u = -1, s = -1, o = !1, l = [];
    if (e.editable)
      for (let c = 0; c < t.length; c++) {
        let f = this.registerMutation(t[c], l);
        f && (u = u < 0 ? f.from : Math.min(f.from, u), s = s < 0 ? f.to : Math.max(f.to, s), f.typeOver && (o = !0));
      }
    if (l.some((c) => c.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || j && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((c) => c.type == "childList" && c.removedNodes.length))) {
      for (let c of l)
        if (c.nodeName == "BR" && c.parentNode) {
          let f = c.nextSibling;
          for (; f && f.nodeType == 1; ) {
            if (f.contentEditable == "false") {
              c.parentNode.removeChild(c);
              break;
            }
            f = f.firstChild;
          }
        }
    } else if (de && l.length) {
      let c = l.filter((f) => f.nodeName == "BR");
      if (c.length == 2) {
        let [f, d] = c;
        f.parentNode && f.parentNode.parentNode == d.parentNode ? d.remove() : f.remove();
      } else {
        let { focusNode: f } = this.currentSelection;
        for (let d of c) {
          let p = d.parentNode;
          p && p.nodeName == "LI" && (!f || Y0(e, f) != p) && d.remove();
        }
      }
    }
    let a = null;
    u < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Er(r) && (a = Ki(e)) && a.eq(R.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Re(e), this.currentSelection.set(r), e.scrollToSelection()) : (u > -1 || i) && (u > -1 && (e.docView.markDirty(u, s), Z0(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, X0(e, l)), this.handleDOMChange(u, s, o, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Re(e), this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
    e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let c = 0; c < e.addedNodes.length; c++) {
        let f = e.addedNodes[c];
        t.push(f), f.nodeType == 3 && (this.lastChangedTextNode = f);
      }
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let i = e.previousSibling, u = e.nextSibling;
      if (re && Je <= 11 && e.addedNodes.length)
        for (let c = 0; c < e.addedNodes.length; c++) {
          let { previousSibling: f, nextSibling: d } = e.addedNodes[c];
          (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (i = f), (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (u = d);
        }
      let s = i && i.parentNode == e.target ? G(i) + 1 : 0, o = r.localPosFromDOM(e.target, s, -1), l = u && u.parentNode == e.target ? G(u) : e.target.childNodes.length, a = r.localPosFromDOM(e.target, l, 1);
      return { from: o, to: a };
    } else return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : (this.lastChangedTextNode = e.target, {
      from: r.posAtStart,
      to: r.posAtEnd,
      // An event was generated for a text change that didn't change
      // any text. Mark the dom change to fall back to assuming the
      // selection was typed over with an identical value if it can't
      // find another change.
      typeOver: e.target.nodeValue == e.oldValue
    });
  }
}
let ps = /* @__PURE__ */ new WeakMap(), ms = !1;
function Z0(n) {
  if (!ps.has(n) && (ps.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = de, ms)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), ms = !0;
  }
}
function gs(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, u = e.endOffset, s = n.domAtPos(n.state.selection.anchor);
  return bt(s.node, s.offset, i, u) && ([t, r, i, u] = [i, u, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: u };
}
function G0(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return gs(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? gs(n, t) : null;
}
function Y0(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function X0(n, e) {
  var t;
  let { focusNode: r, focusOffset: i } = n.domSelectionRange();
  for (let u of e)
    if (((t = u.parentNode) === null || t === void 0 ? void 0 : t.nodeName) == "TR") {
      let s = u.nextSibling;
      for (; s && s.nodeName != "TD" && s.nodeName != "TH"; )
        s = s.nextSibling;
      if (s) {
        let o = s;
        for (; ; ) {
          let l = o.firstChild;
          if (!l || l.nodeType != 1 || l.contentEditable == "false" || /^(BR|IMG)$/.test(l.nodeName))
            break;
          o = l;
        }
        o.insertBefore(u, o.firstChild), r == u && n.domSelection().collapse(u, i);
      } else
        u.parentNode.removeChild(u);
    }
}
function Q0(n, e, t) {
  let { node: r, fromOffset: i, toOffset: u, from: s, to: o } = n.docView.parseRange(e, t), l = n.domSelectionRange(), a, c = l.anchorNode;
  if (c && n.dom.contains(c.nodeType == 1 ? c : c.parentNode) && (a = [{ node: c, offset: l.anchorOffset }], Er(l) || a.push({ node: l.focusNode, offset: l.focusOffset })), j && n.input.lastKeyCode === 8)
    for (let g = u; g > i; g--) {
      let b = r.childNodes[g - 1], C = b.pmViewDesc;
      if (b.nodeName == "BR" && !C) {
        u = g;
        break;
      }
      if (!C || C.size)
        break;
    }
  let f = n.state.doc, d = n.someProp("domParser") || on.fromSchema(n.state.schema), p = f.resolve(s), h = null, m = d.parse(r, {
    topNode: p.parent,
    topMatch: p.parent.contentMatchAt(p.index()),
    topOpen: !0,
    from: i,
    to: u,
    preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: a,
    ruleFromNode: eh,
    context: p
  });
  if (a && a[0].pos != null) {
    let g = a[0].pos, b = a[1] && a[1].pos;
    b == null && (b = g), h = { anchor: g + s, head: b + s };
  }
  return { doc: m, sel: h, from: s, to: o };
}
function eh(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (X && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || X && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const th = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function nh(n, e, t, r, i) {
  let u = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let w = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, F = Ki(n, w);
    if (F && !n.state.selection.eq(F)) {
      if (j && ve && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (et) => et(n, rt(13, "Enter"))))
        return;
      let P = n.state.tr.setSelection(F);
      w == "pointer" ? P.setMeta("pointer", !0) : w == "key" && P.scrollIntoView(), u && P.setMeta("composition", u), n.dispatch(P);
    }
    return;
  }
  let s = n.state.doc.resolve(e), o = s.sharedDepth(t);
  e = s.before(o + 1), t = n.state.doc.resolve(t).after(o + 1);
  let l = n.state.selection, a = Q0(n, e, t), c = n.state.doc, f = c.slice(a.from, a.to), d, p;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (d = n.state.selection.to, p = "end") : (d = n.state.selection.from, p = "start"), n.input.lastKeyCode = null;
  let h = uh(f.content, a.doc.content, a.from, d, p);
  if (h && n.input.domChangeCount++, (Rt && n.input.lastIOSEnter > Date.now() - 225 || ve) && i.some((w) => w.nodeType == 1 && !th.test(w.nodeName)) && (!h || h.endA >= h.endB) && n.someProp("handleKeyDown", (w) => w(n, rt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!h)
    if (r && l instanceof I && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(a.sel && a.sel.anchor != a.sel.head))
      h = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (a.sel) {
        let w = bs(n, n.state.doc, a.sel);
        if (w && !w.eq(n.state.selection)) {
          let F = n.state.tr.setSelection(w);
          u && F.setMeta("composition", u), n.dispatch(F);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && h.start == h.endB && n.state.selection instanceof I && (h.start > n.state.selection.from && h.start <= n.state.selection.from + 2 && n.state.selection.from >= a.from ? h.start = n.state.selection.from : h.endA < n.state.selection.to && h.endA >= n.state.selection.to - 2 && n.state.selection.to <= a.to && (h.endB += n.state.selection.to - h.endA, h.endA = n.state.selection.to)), re && Je <= 11 && h.endB == h.start + 1 && h.endA == h.start && h.start > a.from && a.doc.textBetween(h.start - a.from - 1, h.start - a.from + 1) == "  " && (h.start--, h.endA--, h.endB--);
  let m = a.doc.resolveNoCache(h.start - a.from), g = a.doc.resolveNoCache(h.endB - a.from), b = c.resolve(h.start), C = m.sameParent(g) && m.parent.inlineContent && b.end() >= h.endA;
  if ((Rt && n.input.lastIOSEnter > Date.now() - 225 && (!C || i.some((w) => w.nodeName == "DIV" || w.nodeName == "P")) || !C && m.pos < a.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(a.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (w) => w(n, rt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > h.start && ih(c, h.start, h.endA, m, g) && n.someProp("handleKeyDown", (w) => w(n, rt(8, "Backspace")))) {
    ve && j && n.domObserver.suppressSelectionUpdates();
    return;
  }
  j && h.endB == h.start && (n.input.lastChromeDelete = Date.now()), ve && !C && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && a.sel && a.sel.anchor == a.sel.head && a.sel.head == h.endA && (h.endB -= 2, g = a.doc.resolveNoCache(h.endB - a.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(w) {
      return w(n, rt(13, "Enter"));
    });
  }, 20));
  let D = h.start, A = h.endA, M = (w) => {
    let F = w || n.state.tr.replace(D, A, a.doc.slice(h.start - a.from, h.endB - a.from));
    if (a.sel) {
      let P = bs(n, F.doc, a.sel);
      P && !(j && n.composing && P.empty && (h.start != h.endB || n.input.lastChromeDelete < Date.now() - 100) && (P.head == D || P.head == F.mapping.map(A) - 1) || re && P.empty && P.head == D) && F.setSelection(P);
    }
    return u && F.setMeta("composition", u), F.scrollIntoView();
  }, O;
  if (C)
    if (m.pos == g.pos) {
      re && Je <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Re(n), 20));
      let w = M(n.state.tr.delete(D, A)), F = c.resolve(h.start).marksAcross(c.resolve(h.endA));
      F && w.ensureMarks(F), n.dispatch(w);
    } else if (
      // Adding or removing a mark
      h.endA == h.endB && (O = rh(m.parent.content.cut(m.parentOffset, g.parentOffset), b.parent.content.cut(b.parentOffset, h.endA - b.start())))
    ) {
      let w = M(n.state.tr);
      O.type == "add" ? w.addMark(D, A, O.mark) : w.removeMark(D, A, O.mark), n.dispatch(w);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let w = m.parent.textBetween(m.parentOffset, g.parentOffset), F = () => M(n.state.tr.insertText(w, D, A));
      n.someProp("handleTextInput", (P) => P(n, D, A, w, F)) || n.dispatch(F());
    } else
      n.dispatch(M());
  else
    n.dispatch(M());
}
function bs(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Zi(n, e.resolve(t.anchor), e.resolve(t.head));
}
function rh(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, i = t, u = r, s, o, l;
  for (let c = 0; c < r.length; c++)
    i = r[c].removeFromSet(i);
  for (let c = 0; c < t.length; c++)
    u = t[c].removeFromSet(u);
  if (i.length == 1 && u.length == 0)
    o = i[0], s = "add", l = (c) => c.mark(o.addToSet(c.marks));
  else if (i.length == 0 && u.length == 1)
    o = u[0], s = "remove", l = (c) => c.mark(o.removeFromSet(c.marks));
  else
    return null;
  let a = [];
  for (let c = 0; c < e.childCount; c++)
    a.push(l(e.child(c)));
  if (k.from(a).eq(n))
    return { mark: o, type: s };
}
function ih(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    Xr(r, !0, !1) < i.pos
  )
    return !1;
  let u = n.resolve(e);
  if (!r.parent.isTextblock) {
    let o = u.nodeAfter;
    return o != null && t == e + o.nodeSize;
  }
  if (u.parentOffset < u.parent.content.size || !u.parent.isTextblock)
    return !1;
  let s = n.resolve(Xr(u, !0, !0));
  return !s.parent.isTextblock || s.pos > t || Xr(s, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(s.parent.content);
}
function Xr(n, e, t) {
  let r = n.depth, i = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, i++, e = !1;
  if (t) {
    let u = n.node(r).maybeChild(n.indexAfter(r));
    for (; u && !u.isLeaf; )
      u = u.firstChild, i++;
  }
  return i;
}
function uh(n, e, t, r, i) {
  let u = n.findDiffStart(e, t), s = t + n.size, o = t + e.size;
  if (u == null)
    return null;
  let { a: l, b: a } = n.findDiffEnd(e, s, o);
  if (i == "end") {
    let c = Math.max(0, u - Math.min(l, a));
    r -= l + c - u;
  }
  if (l < u && s < o) {
    let c = r <= u && r >= l ? u - r : 0;
    u -= c, a = u + (a - l), l = u;
  } else if (a < u) {
    let c = r <= u && r >= a ? u - r : 0;
    u -= c, l = u + (l - a), a = u;
  }
  return { start: u, endA: l, endB: a };
}
class Tl {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new C0(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Ds), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = ks(this), ys(this), this.nodeViews = Cs(this), this.docView = Qu(this.state.doc, xs(this), Yr(this), this.dom, this), this.domObserver = new K0(this, (r, i, u, s) => nh(this, r, i, u, s)), this.domObserver.start(), D0(this), this.updatePluginViews();
  }
  /**
  Holds `true` when a
  [composition](https://w3c.github.io/uievents/#events-compositionevents)
  is active.
  */
  get composing() {
    return this.input.composing;
  }
  /**
  The view's current [props](https://prosemirror.net/docs/ref/#view.EditorProps).
  */
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  /**
  Update the view's props. Will immediately cause an update to
  the DOM.
  */
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && Ei(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Ds), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
  }
  /**
  Update the view by updating existing props object with the object
  given as argument. Equivalent to `view.update(Object.assign({},
  view.props, props))`.
  */
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  /**
  Update the editor's `state` prop, without touching any of the
  other props.
  */
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var r;
    let i = this.state, u = !1, s = !1;
    e.storedMarks && this.composing && (Dl(this), s = !0), this.state = e;
    let o = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (o || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let p = Cs(this);
      oh(p, this.nodeViews) && (this.nodeViews = p, u = !0);
    }
    (o || t.handleDOMEvents != this._props.handleDOMEvents) && Ei(this), this.editable = ks(this), ys(this);
    let l = Yr(this), a = xs(this), c = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", f = u || !this.docView.matchesNode(e.doc, a, l);
    (f || !e.selection.eq(i.selection)) && (s = !0);
    let d = c == "preserve" && s && this.dom.style.overflowAnchor == null && Bf(this);
    if (s) {
      this.domObserver.stop();
      let p = f && (re || j) && !this.composing && !i.selection.empty && !e.selection.empty && sh(i.selection, e.selection);
      if (f) {
        let m = j ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = $0(this)), (u || !this.docView.update(e.doc, a, l, this)) && (this.docView.updateOuterDeco(a), this.docView.destroy(), this.docView = Qu(e.doc, a, l, this.dom, this)), m && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (p = !0);
      }
      let h = this.input.mouseDown;
      p || !(h && this.domObserver.currentSelection.eq(this.domSelectionRange()) && s0(this) && h.delaySelUpdate()) ? Re(this, p) : (ll(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : d && $f(d);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof T) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && Ku(this, t.getBoundingClientRect(), e);
      } else
        Ku(this, this.coordsAtPos(this.state.selection.head, 1), e);
    }
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let r = e.node, i = -1;
    if (r.from < this.state.doc.content.size && this.state.doc.nodeAt(r.from) == r.node)
      i = r.from;
    else {
      let u = r.from + (this.state.doc.content.size - t.doc.content.size);
      (u > 0 && u < this.state.doc.content.size && this.state.doc.nodeAt(u)) == r.node && (i = u);
    }
    this.dragging = new El(e.slice, e.move, i < 0 ? void 0 : T.create(this.state.doc, i));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], i;
    if (r != null && (i = t ? t(r) : r))
      return i;
    for (let s = 0; s < this.directPlugins.length; s++) {
      let o = this.directPlugins[s].props[e];
      if (o != null && (i = t ? t(o) : o))
        return i;
    }
    let u = this.state.plugins;
    if (u)
      for (let s = 0; s < u.length; s++) {
        let o = u[s].props[e];
        if (o != null && (i = t ? t(o) : o))
          return i;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (re) {
      let e = this.root.activeElement;
      if (e == this.dom)
        return !0;
      if (!e || !this.dom.contains(e))
        return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false")
          return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  /**
  Focus the editor.
  */
  focus() {
    this.domObserver.stop(), this.editable && Pf(this.dom), Re(this), this.domObserver.start();
  }
  /**
  Get the document root in which the editor exists. This will
  usually be the top-level `document`, but might be a [shadow
  DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  root if the editor is inside one.
  */
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  /**
  When an existing editor view is moved to a new document or
  shadow tree, call this to make it recompute its root.
  */
  updateRoot() {
    this._root = null;
  }
  /**
  Given a pair of viewport coordinates, return the document
  position that corresponds to them. May return null if the given
  coordinates aren't inside of the editor. When an object is
  returned, its `pos` property is the position nearest to the
  coordinates, and its `inside` property holds the position of the
  inner node that the position falls inside of, or -1 if it is at
  the top level, not in any node.
  */
  posAtCoords(e) {
    return Hf(this, e);
  }
  /**
  Returns the viewport rectangle at a given document position.
  `left` and `right` will be the same number, as this returns a
  flat cursor-ish rectangle. If the position is between two things
  that aren't directly adjacent, `side` determines which element
  is used. When < 0, the element before the position is used,
  otherwise the element after.
  */
  coordsAtPos(e, t = 1) {
    return el(this, e, t);
  }
  /**
  Find the DOM position that corresponds to the given document
  position. When `side` is negative, find the position as close as
  possible to the content before the position. When positive,
  prefer positions close to the content after the position. When
  zero, prefer as shallow a position as possible.
  
  Note that you should **not** mutate the editor's internal DOM,
  only inspect it (and even that is usually not necessary).
  */
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  /**
  Find the DOM node that represents the document node after the
  given position. May return `null` when the position doesn't point
  in front of a node or if the node is inside an opaque node view.
  
  This is intended to be able to call things like
  `getBoundingClientRect` on that DOM node. Do **not** mutate the
  editor DOM directly, or add styling this way, since that will be
  immediately overriden by the editor as it redraws the node.
  */
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  /**
  Find the document position that corresponds to a given DOM
  position. (Whenever possible, it is preferable to inspect the
  document structure directly, rather than poking around in the
  DOM, but sometimes—for example when interpreting an event
  target—you don't have a choice.)
  
  The `bias` parameter can be used to influence which side of a DOM
  node to use when the position is inside a leaf node.
  */
  posAtDOM(e, t, r = -1) {
    let i = this.docView.posFromDOM(e, t, r);
    if (i == null)
      throw new RangeError("DOM position not inside the editor");
    return i;
  }
  /**
  Find out whether the selection is at the end of a textblock when
  moving in a given direction. When, for example, given `"left"`,
  it will return true if moving left from the current cursor
  position would leave that position's parent textblock. Will apply
  to the view's current state by default, but it is possible to
  pass a different state.
  */
  endOfTextblock(e, t) {
    return Kf(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return hn(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return hn(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Serialize the given slice as it would be if it was copied from
  this editor. Returns a DOM element that contains a
  representation of the slice as its children, a textual
  representation, and the transformed slice (which can be
  different from the given input due to hooks like
  [`transformCopied`](https://prosemirror.net/docs/ref/#view.EditorProps.transformCopied)).
  */
  serializeForClipboard(e) {
    return Gi(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (S0(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Yr(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, wf());
  }
  /**
  This is true when the view has been
  [destroyed](https://prosemirror.net/docs/ref/#view.EditorView.destroy) (and thus should not be
  used anymore).
  */
  get isDestroyed() {
    return this.docView == null;
  }
  /**
  Used for testing.
  */
  dispatchEvent(e) {
    return _0(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? X && this.root.nodeType === 11 && Nf(this.dom.ownerDocument) == this.dom && G0(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Tl.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function xs(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [he.node(0, n.state.doc.content.size, e)];
}
function ys(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: he.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function ks(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function sh(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Cs(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function oh(n, e) {
  let t = 0, r = 0;
  for (let i in n) {
    if (n[i] != e[i])
      return !0;
    t++;
  }
  for (let i in e)
    r++;
  return t != r;
}
function Ds(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
const Ss = {};
function lh(n) {
  let e = Ss[n];
  if (e)
    return e;
  e = Ss[n] = [];
  for (let t = 0; t < 128; t++) {
    const r = String.fromCharCode(t);
    e.push(r);
  }
  for (let t = 0; t < n.length; t++) {
    const r = n.charCodeAt(t);
    e[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
  }
  return e;
}
function Bt(n, e) {
  typeof e != "string" && (e = Bt.defaultChars);
  const t = lh(e);
  return n.replace(/(%[a-f0-9]{2})+/gi, function(r) {
    let i = "";
    for (let u = 0, s = r.length; u < s; u += 3) {
      const o = parseInt(r.slice(u + 1, u + 3), 16);
      if (o < 128) {
        i += t[o];
        continue;
      }
      if ((o & 224) === 192 && u + 3 < s) {
        const l = parseInt(r.slice(u + 4, u + 6), 16);
        if ((l & 192) === 128) {
          const a = o << 6 & 1984 | l & 63;
          a < 128 ? i += "��" : i += String.fromCharCode(a), u += 3;
          continue;
        }
      }
      if ((o & 240) === 224 && u + 6 < s) {
        const l = parseInt(r.slice(u + 4, u + 6), 16), a = parseInt(r.slice(u + 7, u + 9), 16);
        if ((l & 192) === 128 && (a & 192) === 128) {
          const c = o << 12 & 61440 | l << 6 & 4032 | a & 63;
          c < 2048 || c >= 55296 && c <= 57343 ? i += "���" : i += String.fromCharCode(c), u += 6;
          continue;
        }
      }
      if ((o & 248) === 240 && u + 9 < s) {
        const l = parseInt(r.slice(u + 4, u + 6), 16), a = parseInt(r.slice(u + 7, u + 9), 16), c = parseInt(r.slice(u + 10, u + 12), 16);
        if ((l & 192) === 128 && (a & 192) === 128 && (c & 192) === 128) {
          let f = o << 18 & 1835008 | l << 12 & 258048 | a << 6 & 4032 | c & 63;
          f < 65536 || f > 1114111 ? i += "����" : (f -= 65536, i += String.fromCharCode(55296 + (f >> 10), 56320 + (f & 1023))), u += 9;
          continue;
        }
      }
      i += "�";
    }
    return i;
  });
}
Bt.defaultChars = ";/?:@&=+$,#";
Bt.componentChars = "";
const Es = {};
function ah(n) {
  let e = Es[n];
  if (e)
    return e;
  e = Es[n] = [];
  for (let t = 0; t < 128; t++) {
    const r = String.fromCharCode(t);
    /^[0-9a-z]$/i.test(r) ? e.push(r) : e.push("%" + ("0" + t.toString(16).toUpperCase()).slice(-2));
  }
  for (let t = 0; t < n.length; t++)
    e[n.charCodeAt(t)] = n[t];
  return e;
}
function $n(n, e, t) {
  typeof e != "string" && (t = e, e = $n.defaultChars), typeof t > "u" && (t = !0);
  const r = ah(e);
  let i = "";
  for (let u = 0, s = n.length; u < s; u++) {
    const o = n.charCodeAt(u);
    if (t && o === 37 && u + 2 < s && /^[0-9a-f]{2}$/i.test(n.slice(u + 1, u + 3))) {
      i += n.slice(u, u + 3), u += 2;
      continue;
    }
    if (o < 128) {
      i += r[o];
      continue;
    }
    if (o >= 55296 && o <= 57343) {
      if (o >= 55296 && o <= 56319 && u + 1 < s) {
        const l = n.charCodeAt(u + 1);
        if (l >= 56320 && l <= 57343) {
          i += encodeURIComponent(n[u] + n[u + 1]), u++;
          continue;
        }
      }
      i += "%EF%BF%BD";
      continue;
    }
    i += encodeURIComponent(n[u]);
  }
  return i;
}
$n.defaultChars = ";/?:@&=+$,-_.!~*'()#";
$n.componentChars = "-_.!~*'()";
function nu(n) {
  let e = "";
  return e += n.protocol || "", e += n.slashes ? "//" : "", e += n.auth ? n.auth + "@" : "", n.hostname && n.hostname.indexOf(":") !== -1 ? e += "[" + n.hostname + "]" : e += n.hostname || "", e += n.port ? ":" + n.port : "", e += n.pathname || "", e += n.search || "", e += n.hash || "", e;
}
function gr() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
const ch = /^([a-z0-9.+-]+:)/i, fh = /:[0-9]*$/, hh = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, dh = ["<", ">", '"', "`", " ", "\r", `
`, "	"], ph = ["{", "}", "|", "\\", "^", "`"].concat(dh), mh = ["'"].concat(ph), _s = ["%", "/", "?", ";", "#"].concat(mh), ws = ["/", "?", "#"], gh = 255, As = /^[+a-z0-9A-Z_-]{0,63}$/, bh = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Ms = {
  javascript: !0,
  "javascript:": !0
}, Ts = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
};
function ru(n, e) {
  if (n && n instanceof gr) return n;
  const t = new gr();
  return t.parse(n, e), t;
}
gr.prototype.parse = function(n, e) {
  let t, r, i, u = n;
  if (u = u.trim(), !e && n.split("#").length === 1) {
    const a = hh.exec(u);
    if (a)
      return this.pathname = a[1], a[2] && (this.search = a[2]), this;
  }
  let s = ch.exec(u);
  if (s && (s = s[0], t = s.toLowerCase(), this.protocol = s, u = u.substr(s.length)), (e || s || u.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = u.substr(0, 2) === "//", i && !(s && Ms[s]) && (u = u.substr(2), this.slashes = !0)), !Ms[s] && (i || s && !Ts[s])) {
    let a = -1;
    for (let h = 0; h < ws.length; h++)
      r = u.indexOf(ws[h]), r !== -1 && (a === -1 || r < a) && (a = r);
    let c, f;
    a === -1 ? f = u.lastIndexOf("@") : f = u.lastIndexOf("@", a), f !== -1 && (c = u.slice(0, f), u = u.slice(f + 1), this.auth = c), a = -1;
    for (let h = 0; h < _s.length; h++)
      r = u.indexOf(_s[h]), r !== -1 && (a === -1 || r < a) && (a = r);
    a === -1 && (a = u.length), u[a - 1] === ":" && a--;
    const d = u.slice(0, a);
    u = u.slice(a), this.parseHost(d), this.hostname = this.hostname || "";
    const p = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!p) {
      const h = this.hostname.split(/\./);
      for (let m = 0, g = h.length; m < g; m++) {
        const b = h[m];
        if (b && !b.match(As)) {
          let C = "";
          for (let D = 0, A = b.length; D < A; D++)
            b.charCodeAt(D) > 127 ? C += "x" : C += b[D];
          if (!C.match(As)) {
            const D = h.slice(0, m), A = h.slice(m + 1), M = b.match(bh);
            M && (D.push(M[1]), A.unshift(M[2])), A.length && (u = A.join(".") + u), this.hostname = D.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > gh && (this.hostname = ""), p && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  const o = u.indexOf("#");
  o !== -1 && (this.hash = u.substr(o), u = u.slice(0, o));
  const l = u.indexOf("?");
  return l !== -1 && (this.search = u.substr(l), u = u.slice(0, l)), u && (this.pathname = u), Ts[t] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
gr.prototype.parseHost = function(n) {
  let e = fh.exec(n);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), n = n.substr(0, n.length - e.length)), n && (this.hostname = n);
};
const xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Bt,
  encode: $n,
  format: nu,
  parse: ru
}, Symbol.toStringTag, { value: "Module" })), Ol = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Nl = /[\0-\x1F\x7F-\x9F]/, yh = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, iu = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, Fl = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, vl = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: Ol,
  Cc: Nl,
  Cf: yh,
  P: iu,
  S: Fl,
  Z: vl
}, Symbol.toStringTag, { value: "Module" })), Ch = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((n) => n.charCodeAt(0))
), Dh = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((n) => n.charCodeAt(0))
);
var Qr;
const Sh = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]), Eh = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (Qr = String.fromCodePoint) !== null && Qr !== void 0 ? Qr : function(n) {
    let e = "";
    return n > 65535 && (n -= 65536, e += String.fromCharCode(n >>> 10 & 1023 | 55296), n = 56320 | n & 1023), e += String.fromCharCode(n), e;
  }
);
function _h(n) {
  var e;
  return n >= 55296 && n <= 57343 || n > 1114111 ? 65533 : (e = Sh.get(n)) !== null && e !== void 0 ? e : n;
}
var W;
(function(n) {
  n[n.NUM = 35] = "NUM", n[n.SEMI = 59] = "SEMI", n[n.EQUALS = 61] = "EQUALS", n[n.ZERO = 48] = "ZERO", n[n.NINE = 57] = "NINE", n[n.LOWER_A = 97] = "LOWER_A", n[n.LOWER_F = 102] = "LOWER_F", n[n.LOWER_X = 120] = "LOWER_X", n[n.LOWER_Z = 122] = "LOWER_Z", n[n.UPPER_A = 65] = "UPPER_A", n[n.UPPER_F = 70] = "UPPER_F", n[n.UPPER_Z = 90] = "UPPER_Z";
})(W || (W = {}));
const wh = 32;
var je;
(function(n) {
  n[n.VALUE_LENGTH = 49152] = "VALUE_LENGTH", n[n.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", n[n.JUMP_TABLE = 127] = "JUMP_TABLE";
})(je || (je = {}));
function _i(n) {
  return n >= W.ZERO && n <= W.NINE;
}
function Ah(n) {
  return n >= W.UPPER_A && n <= W.UPPER_F || n >= W.LOWER_A && n <= W.LOWER_F;
}
function Mh(n) {
  return n >= W.UPPER_A && n <= W.UPPER_Z || n >= W.LOWER_A && n <= W.LOWER_Z || _i(n);
}
function Th(n) {
  return n === W.EQUALS || Mh(n);
}
var H;
(function(n) {
  n[n.EntityStart = 0] = "EntityStart", n[n.NumericStart = 1] = "NumericStart", n[n.NumericDecimal = 2] = "NumericDecimal", n[n.NumericHex = 3] = "NumericHex", n[n.NamedEntity = 4] = "NamedEntity";
})(H || (H = {}));
var Fe;
(function(n) {
  n[n.Legacy = 0] = "Legacy", n[n.Strict = 1] = "Strict", n[n.Attribute = 2] = "Attribute";
})(Fe || (Fe = {}));
class Oh {
  constructor(e, t, r) {
    this.decodeTree = e, this.emitCodePoint = t, this.errors = r, this.state = H.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Fe.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(e) {
    this.decodeMode = e, this.state = H.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(e, t) {
    switch (this.state) {
      case H.EntityStart:
        return e.charCodeAt(t) === W.NUM ? (this.state = H.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = H.NamedEntity, this.stateNamedEntity(e, t));
      case H.NumericStart:
        return this.stateNumericStart(e, t);
      case H.NumericDecimal:
        return this.stateNumericDecimal(e, t);
      case H.NumericHex:
        return this.stateNumericHex(e, t);
      case H.NamedEntity:
        return this.stateNamedEntity(e, t);
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(e, t) {
    return t >= e.length ? -1 : (e.charCodeAt(t) | wh) === W.LOWER_X ? (this.state = H.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = H.NumericDecimal, this.stateNumericDecimal(e, t));
  }
  addToNumericResult(e, t, r, i) {
    if (t !== r) {
      const u = r - t;
      this.result = this.result * Math.pow(i, u) + parseInt(e.substr(t, u), i), this.consumed += u;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(e, t) {
    const r = t;
    for (; t < e.length; ) {
      const i = e.charCodeAt(t);
      if (_i(i) || Ah(i))
        t += 1;
      else
        return this.addToNumericResult(e, r, t, 16), this.emitNumericEntity(i, 3);
    }
    return this.addToNumericResult(e, r, t, 16), -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(e, t) {
    const r = t;
    for (; t < e.length; ) {
      const i = e.charCodeAt(t);
      if (_i(i))
        t += 1;
      else
        return this.addToNumericResult(e, r, t, 10), this.emitNumericEntity(i, 2);
    }
    return this.addToNumericResult(e, r, t, 10), -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(e, t) {
    var r;
    if (this.consumed <= t)
      return (r = this.errors) === null || r === void 0 || r.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
    if (e === W.SEMI)
      this.consumed += 1;
    else if (this.decodeMode === Fe.Strict)
      return 0;
    return this.emitCodePoint(_h(this.result), this.consumed), this.errors && (e !== W.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(e, t) {
    const { decodeTree: r } = this;
    let i = r[this.treeIndex], u = (i & je.VALUE_LENGTH) >> 14;
    for (; t < e.length; t++, this.excess++) {
      const s = e.charCodeAt(t);
      if (this.treeIndex = Nh(r, i, this.treeIndex + Math.max(1, u), s), this.treeIndex < 0)
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === Fe.Attribute && // We shouldn't have consumed any characters after the entity,
        (u === 0 || // And there should be no invalid characters.
        Th(s)) ? 0 : this.emitNotTerminatedNamedEntity();
      if (i = r[this.treeIndex], u = (i & je.VALUE_LENGTH) >> 14, u !== 0) {
        if (s === W.SEMI)
          return this.emitNamedEntityData(this.treeIndex, u, this.consumed + this.excess);
        this.decodeMode !== Fe.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var e;
    const { result: t, decodeTree: r } = this, i = (r[t] & je.VALUE_LENGTH) >> 14;
    return this.emitNamedEntityData(t, i, this.consumed), (e = this.errors) === null || e === void 0 || e.missingSemicolonAfterCharacterReference(), this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(e, t, r) {
    const { decodeTree: i } = this;
    return this.emitCodePoint(t === 1 ? i[e] & ~je.VALUE_LENGTH : i[e + 1], r), t === 3 && this.emitCodePoint(i[e + 2], r), r;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var e;
    switch (this.state) {
      case H.NamedEntity:
        return this.result !== 0 && (this.decodeMode !== Fe.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      // Otherwise, emit a numeric entity if we have one.
      case H.NumericDecimal:
        return this.emitNumericEntity(0, 2);
      case H.NumericHex:
        return this.emitNumericEntity(0, 3);
      case H.NumericStart:
        return (e = this.errors) === null || e === void 0 || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
      case H.EntityStart:
        return 0;
    }
  }
}
function Il(n) {
  let e = "";
  const t = new Oh(n, (r) => e += Eh(r));
  return function(i, u) {
    let s = 0, o = 0;
    for (; (o = i.indexOf("&", o)) >= 0; ) {
      e += i.slice(s, o), t.startEntity(u);
      const a = t.write(
        i,
        // Skip the "&"
        o + 1
      );
      if (a < 0) {
        s = o + t.end();
        break;
      }
      s = o + a, o = a === 0 ? s + 1 : s;
    }
    const l = e + i.slice(s);
    return e = "", l;
  };
}
function Nh(n, e, t, r) {
  const i = (e & je.BRANCH_LENGTH) >> 7, u = e & je.JUMP_TABLE;
  if (i === 0)
    return u !== 0 && r === u ? t : -1;
  if (u) {
    const l = r - u;
    return l < 0 || l >= i ? -1 : n[t + l] - 1;
  }
  let s = t, o = s + i - 1;
  for (; s <= o; ) {
    const l = s + o >>> 1, a = n[l];
    if (a < r)
      s = l + 1;
    else if (a > r)
      o = l - 1;
    else
      return n[l + i];
  }
  return -1;
}
const Rl = Il(Ch);
Il(Dh);
function Fh(n, e = Fe.Legacy) {
  return Rl(n, e);
}
function vh(n) {
  return Rl(n, Fe.Strict);
}
function Ih(n) {
  return Object.prototype.toString.call(n);
}
function uu(n) {
  return Ih(n) === "[object String]";
}
const Rh = Object.prototype.hasOwnProperty;
function Bh(n, e) {
  return Rh.call(n, e);
}
function wr(n) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
    if (t) {
      if (typeof t != "object")
        throw new TypeError(t + "must be object");
      Object.keys(t).forEach(function(r) {
        n[r] = t[r];
      });
    }
  }), n;
}
function Bl(n, e, t) {
  return [].concat(n.slice(0, e), t, n.slice(e + 1));
}
function su(n) {
  return !(n >= 55296 && n <= 57343 || n >= 64976 && n <= 65007 || (n & 65535) === 65535 || (n & 65535) === 65534 || n >= 0 && n <= 8 || n === 11 || n >= 14 && n <= 31 || n >= 127 && n <= 159 || n > 1114111);
}
function pn(n) {
  if (n > 65535) {
    n -= 65536;
    const e = 55296 + (n >> 10), t = 56320 + (n & 1023);
    return String.fromCharCode(e, t);
  }
  return String.fromCharCode(n);
}
const $l = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, $h = /&([a-z#][a-z0-9]{1,31});/gi, Ph = new RegExp($l.source + "|" + $h.source, "gi"), zh = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function Lh(n, e) {
  if (e.charCodeAt(0) === 35 && zh.test(e)) {
    const r = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return su(r) ? pn(r) : n;
  }
  const t = Fh(n);
  return t !== n ? t : n;
}
function Vh(n) {
  return n.indexOf("\\") < 0 ? n : n.replace($l, "$1");
}
function $t(n) {
  return n.indexOf("\\") < 0 && n.indexOf("&") < 0 ? n : n.replace(Ph, function(e, t, r) {
    return t || Lh(e, r);
  });
}
const qh = /[&<>"]/, Hh = /[&<>"]/g, Uh = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function Wh(n) {
  return Uh[n];
}
function Xe(n) {
  return qh.test(n) ? n.replace(Hh, Wh) : n;
}
const jh = /[.?*+^$[\]\\(){}|-]/g;
function Jh(n) {
  return n.replace(jh, "\\$&");
}
function B(n) {
  switch (n) {
    case 9:
    case 32:
      return !0;
  }
  return !1;
}
function mn(n) {
  if (n >= 8192 && n <= 8202)
    return !0;
  switch (n) {
    case 9:
    // \t
    case 10:
    // \n
    case 11:
    // \v
    case 12:
    // \f
    case 13:
    // \r
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return !0;
  }
  return !1;
}
function Pl(n) {
  return iu.test(n) || Fl.test(n);
}
function gn(n) {
  return Pl(pn(n));
}
function bn(n) {
  switch (n) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function Ar(n) {
  return n = n.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (n = n.replace(/ẞ/g, "ß")), n.toLowerCase().toUpperCase();
}
function Os(n) {
  return n === 32 || n === 9 || n === 10 || n === 13;
}
function Mr(n) {
  let e = 0;
  for (; e < n.length && Os(n.charCodeAt(e)); e++)
    ;
  let t = n.length - 1;
  for (; t >= e && Os(n.charCodeAt(t)); t--)
    ;
  return n.slice(e, t + 1);
}
const Kh = { mdurl: xh, ucmicro: kh }, Zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayReplaceAt: Bl,
  asciiTrim: Mr,
  assign: wr,
  escapeHtml: Xe,
  escapeRE: Jh,
  fromCodePoint: pn,
  has: Bh,
  isMdAsciiPunct: bn,
  isPunctChar: Pl,
  isPunctCharCode: gn,
  isSpace: B,
  isString: uu,
  isValidEntityCode: su,
  isWhiteSpace: mn,
  lib: Kh,
  normalizeReference: Ar,
  unescapeAll: $t,
  unescapeMd: Vh
}, Symbol.toStringTag, { value: "Module" }));
function Gh(n, e, t) {
  let r, i, u, s;
  const o = n.posMax, l = n.pos;
  for (n.pos = e + 1, r = 1; n.pos < o; ) {
    if (u = n.src.charCodeAt(n.pos), u === 93 && (r--, r === 0)) {
      i = !0;
      break;
    }
    if (s = n.pos, n.md.inline.skipToken(n), u === 91) {
      if (s === n.pos - 1)
        r++;
      else if (t)
        return n.pos = l, -1;
    }
  }
  let a = -1;
  return i && (a = n.pos), n.pos = l, a;
}
function Yh(n, e, t) {
  let r, i = e;
  const u = {
    ok: !1,
    pos: 0,
    str: ""
  };
  if (n.charCodeAt(i) === 60) {
    for (i++; i < t; ) {
      if (r = n.charCodeAt(i), r === 10 || r === 60)
        return u;
      if (r === 62)
        return u.pos = i + 1, u.str = $t(n.slice(e + 1, i)), u.ok = !0, u;
      if (r === 92 && i + 1 < t) {
        i += 2;
        continue;
      }
      i++;
    }
    return u;
  }
  let s = 0;
  for (; i < t && (r = n.charCodeAt(i), !(r === 32 || r < 32 || r === 127)); ) {
    if (r === 92 && i + 1 < t) {
      if (n.charCodeAt(i + 1) === 32)
        break;
      i += 2;
      continue;
    }
    if (r === 40 && (s++, s > 32))
      return u;
    if (r === 41) {
      if (s === 0)
        break;
      s--;
    }
    i++;
  }
  return e === i || s !== 0 || (u.str = $t(n.slice(e, i)), u.pos = i, u.ok = !0), u;
}
function Xh(n, e, t, r) {
  let i, u = e;
  const s = {
    // if `true`, this is a valid link title
    ok: !1,
    // if `true`, this link can be continued on the next line
    can_continue: !1,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (r)
    s.str = r.str, s.marker = r.marker;
  else {
    if (u >= t)
      return s;
    let o = n.charCodeAt(u);
    if (o !== 34 && o !== 39 && o !== 40)
      return s;
    e++, u++, o === 40 && (o = 41), s.marker = o;
  }
  for (; u < t; ) {
    if (i = n.charCodeAt(u), i === s.marker)
      return s.pos = u + 1, s.str += $t(n.slice(e, u)), s.ok = !0, s;
    if (i === 40 && s.marker === 41)
      return s;
    i === 92 && u + 1 < t && u++, u++;
  }
  return s.can_continue = !0, s.str += $t(n.slice(e, u)), s;
}
const Qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseLinkDestination: Yh,
  parseLinkLabel: Gh,
  parseLinkTitle: Xh
}, Symbol.toStringTag, { value: "Module" })), we = {};
we.code_inline = function(n, e, t, r, i) {
  const u = n[e];
  return "<code" + i.renderAttrs(u) + ">" + Xe(u.content) + "</code>";
};
we.code_block = function(n, e, t, r, i) {
  const u = n[e];
  return "<pre" + i.renderAttrs(u) + "><code>" + Xe(n[e].content) + `</code></pre>
`;
};
we.fence = function(n, e, t, r, i) {
  const u = n[e], s = u.info ? $t(u.info).trim() : "";
  let o = "", l = "";
  if (s) {
    const c = s.split(/(\s+)/g);
    o = c[0], l = c.slice(2).join("");
  }
  let a;
  if (t.highlight ? a = t.highlight(u.content, o, l) || Xe(u.content) : a = Xe(u.content), a.indexOf("<pre") === 0)
    return a + `
`;
  if (s) {
    const c = u.attrIndex("class"), f = u.attrs ? u.attrs.slice() : [];
    c < 0 ? f.push(["class", t.langPrefix + o]) : (f[c] = f[c].slice(), f[c][1] += " " + t.langPrefix + o);
    const d = {
      attrs: f
    };
    return `<pre><code${i.renderAttrs(d)}>${a}</code></pre>
`;
  }
  return `<pre><code${i.renderAttrs(u)}>${a}</code></pre>
`;
};
we.image = function(n, e, t, r, i) {
  const u = n[e];
  return u.attrs[u.attrIndex("alt")][1] = i.renderInlineAsText(u.children, t, r), i.renderToken(n, e, t);
};
we.hardbreak = function(n, e, t) {
  return t.xhtmlOut ? `<br />
` : `<br>
`;
};
we.softbreak = function(n, e, t) {
  return t.breaks ? t.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
we.text = function(n, e) {
  return Xe(n[e].content);
};
we.html_block = function(n, e) {
  return n[e].content;
};
we.html_inline = function(n, e) {
  return n[e].content;
};
function zt() {
  this.rules = wr({}, we);
}
zt.prototype.renderAttrs = function(e) {
  let t, r, i;
  if (!e.attrs)
    return "";
  for (i = "", t = 0, r = e.attrs.length; t < r; t++)
    i += " " + Xe(e.attrs[t][0]) + '="' + Xe(e.attrs[t][1]) + '"';
  return i;
};
zt.prototype.renderToken = function(e, t, r) {
  const i = e[t];
  let u = "";
  if (i.hidden)
    return "";
  i.block && i.nesting !== -1 && t && e[t - 1].hidden && (u += `
`), u += (i.nesting === -1 ? "</" : "<") + i.tag, u += this.renderAttrs(i), i.nesting === 0 && r.xhtmlOut && (u += " /");
  let s = !1;
  if (i.block && (s = !0, i.nesting === 1 && t + 1 < e.length)) {
    const o = e[t + 1];
    (o.type === "inline" || o.hidden || o.nesting === -1 && o.tag === i.tag) && (s = !1);
  }
  return u += s ? `>
` : ">", u;
};
zt.prototype.renderInline = function(n, e, t) {
  let r = "";
  const i = this.rules;
  for (let u = 0, s = n.length; u < s; u++) {
    const o = n[u].type;
    typeof i[o] < "u" ? r += i[o](n, u, e, t, this) : r += this.renderToken(n, u, e);
  }
  return r;
};
zt.prototype.renderInlineAsText = function(n, e, t) {
  let r = "";
  for (let i = 0, u = n.length; i < u; i++)
    switch (n[i].type) {
      case "text":
        r += n[i].content;
        break;
      case "image":
        r += this.renderInlineAsText(n[i].children, e, t);
        break;
      case "html_inline":
      case "html_block":
        r += n[i].content;
        break;
      case "softbreak":
      case "hardbreak":
        r += `
`;
        break;
    }
  return r;
};
zt.prototype.render = function(n, e, t) {
  let r = "";
  const i = this.rules;
  for (let u = 0, s = n.length; u < s; u++) {
    const o = n[u].type;
    o === "inline" ? r += this.renderInline(n[u].children, e, t) : typeof i[o] < "u" ? r += i[o](n, u, e, t, this) : r += this.renderToken(n, u, e, t);
  }
  return r;
};
function ie() {
  this.__rules__ = [], this.__cache__ = null;
}
ie.prototype.__find__ = function(n) {
  for (let e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === n)
      return e;
  return -1;
};
ie.prototype.__compile__ = function() {
  const n = this, e = [""];
  n.__rules__.forEach(function(t) {
    t.enabled && t.alt.forEach(function(r) {
      e.indexOf(r) < 0 && e.push(r);
    });
  }), n.__cache__ = {}, e.forEach(function(t) {
    n.__cache__[t] = [], n.__rules__.forEach(function(r) {
      r.enabled && (t && r.alt.indexOf(t) < 0 || n.__cache__[t].push(r.fn));
    });
  });
};
ie.prototype.at = function(n, e, t) {
  const r = this.__find__(n), i = t || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__[r].fn = e, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
};
ie.prototype.before = function(n, e, t, r) {
  const i = this.__find__(n), u = r || {};
  if (i === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__.splice(i, 0, {
    name: e,
    enabled: !0,
    fn: t,
    alt: u.alt || []
  }), this.__cache__ = null;
};
ie.prototype.after = function(n, e, t, r) {
  const i = this.__find__(n), u = r || {};
  if (i === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__.splice(i + 1, 0, {
    name: e,
    enabled: !0,
    fn: t,
    alt: u.alt || []
  }), this.__cache__ = null;
};
ie.prototype.push = function(n, e, t) {
  const r = t || {};
  this.__rules__.push({
    name: n,
    enabled: !0,
    fn: e,
    alt: r.alt || []
  }), this.__cache__ = null;
};
ie.prototype.enable = function(n, e) {
  Array.isArray(n) || (n = [n]);
  const t = [];
  return n.forEach(function(r) {
    const i = this.__find__(r);
    if (i < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[i].enabled = !0, t.push(r);
  }, this), this.__cache__ = null, t;
};
ie.prototype.enableOnly = function(n, e) {
  Array.isArray(n) || (n = [n]), this.__rules__.forEach(function(t) {
    t.enabled = !1;
  }), this.enable(n, e);
};
ie.prototype.disable = function(n, e) {
  Array.isArray(n) || (n = [n]);
  const t = [];
  return n.forEach(function(r) {
    const i = this.__find__(r);
    if (i < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[i].enabled = !1, t.push(r);
  }, this), this.__cache__ = null, t;
};
ie.prototype.getRules = function(n) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[n] || [];
};
function ye(n, e, t) {
  this.type = n, this.tag = e, this.attrs = null, this.map = null, this.nesting = t, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
ye.prototype.attrIndex = function(e) {
  if (!this.attrs)
    return -1;
  const t = this.attrs;
  for (let r = 0, i = t.length; r < i; r++)
    if (t[r][0] === e)
      return r;
  return -1;
};
ye.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
ye.prototype.attrSet = function(e, t) {
  const r = this.attrIndex(e), i = [e, t];
  r < 0 ? this.attrPush(i) : this.attrs[r] = i;
};
ye.prototype.attrGet = function(e) {
  const t = this.attrIndex(e);
  let r = null;
  return t >= 0 && (r = this.attrs[t][1]), r;
};
ye.prototype.attrJoin = function(e, t) {
  const r = this.attrIndex(e);
  r < 0 ? this.attrPush([e, t]) : this.attrs[r][1] = this.attrs[r][1] + " " + t;
};
function zl(n, e, t) {
  this.src = n, this.env = t, this.tokens = [], this.inlineMode = !1, this.md = e;
}
zl.prototype.Token = ye;
const ed = /\r\n?|\n/g, td = /\0/g;
function nd(n) {
  let e;
  e = n.src.replace(ed, `
`), e = e.replace(td, "�"), n.src = e;
}
function rd(n) {
  let e;
  n.inlineMode ? (e = new n.Token("inline", "", 0), e.content = n.src, e.map = [0, 1], e.children = [], n.tokens.push(e)) : n.md.block.parse(n.src, n.md, n.env, n.tokens);
}
function id(n) {
  const e = n.tokens;
  for (let t = 0, r = e.length; t < r; t++) {
    const i = e[t];
    i.type === "inline" && n.md.inline.parse(i.content, n.md, n.env, i.children);
  }
}
function ud(n) {
  return /^<a[>\s]/i.test(n);
}
function sd(n) {
  return /^<\/a\s*>/i.test(n);
}
function od(n) {
  const e = n.tokens;
  if (n.md.options.linkify)
    for (let t = 0, r = e.length; t < r; t++) {
      if (e[t].type !== "inline" || !n.md.linkify.pretest(e[t].content))
        continue;
      let i = e[t].children, u = 0;
      for (let s = i.length - 1; s >= 0; s--) {
        const o = i[s];
        if (o.type === "link_close") {
          for (s--; i[s].level !== o.level && i[s].type !== "link_open"; )
            s--;
          continue;
        }
        if (o.type === "html_inline" && (ud(o.content) && u > 0 && u--, sd(o.content) && u++), !(u > 0) && o.type === "text" && n.md.linkify.test(o.content)) {
          const l = o.content;
          let a = n.md.linkify.match(l);
          const c = [];
          let f = o.level, d = 0;
          a.length > 0 && a[0].index === 0 && s > 0 && i[s - 1].type === "text_special" && (a = a.slice(1));
          for (let p = 0; p < a.length; p++) {
            const h = a[p].url, m = n.md.normalizeLink(h);
            if (!n.md.validateLink(m))
              continue;
            let g = a[p].text;
            a[p].schema ? a[p].schema === "mailto:" && !/^mailto:/i.test(g) ? g = n.md.normalizeLinkText("mailto:" + g).replace(/^mailto:/, "") : g = n.md.normalizeLinkText(g) : g = n.md.normalizeLinkText("http://" + g).replace(/^http:\/\//, "");
            const b = a[p].index;
            if (b > d) {
              const M = new n.Token("text", "", 0);
              M.content = l.slice(d, b), M.level = f, c.push(M);
            }
            const C = new n.Token("link_open", "a", 1);
            C.attrs = [["href", m]], C.level = f++, C.markup = "linkify", C.info = "auto", c.push(C);
            const D = new n.Token("text", "", 0);
            D.content = g, D.level = f, c.push(D);
            const A = new n.Token("link_close", "a", -1);
            A.level = --f, A.markup = "linkify", A.info = "auto", c.push(A), d = a[p].lastIndex;
          }
          if (d < l.length) {
            const p = new n.Token("text", "", 0);
            p.content = l.slice(d), p.level = f, c.push(p);
          }
          e[t].children = i = Bl(i, s, c);
        }
      }
    }
}
const Ll = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, ld = /\((c|tm|r)\)/i, ad = /\((c|tm|r)\)/ig, cd = {
  c: "©",
  r: "®",
  tm: "™"
};
function fd(n, e) {
  return cd[e.toLowerCase()];
}
function hd(n) {
  let e = 0;
  for (let t = n.length - 1; t >= 0; t--) {
    const r = n[t];
    r.type === "text" && !e && (r.content = r.content.replace(ad, fd)), r.type === "link_open" && r.info === "auto" && e--, r.type === "link_close" && r.info === "auto" && e++;
  }
}
function dd(n) {
  let e = 0;
  for (let t = n.length - 1; t >= 0; t--) {
    const r = n[t];
    r.type === "text" && !e && Ll.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), r.type === "link_open" && r.info === "auto" && e--, r.type === "link_close" && r.info === "auto" && e++;
  }
}
function pd(n) {
  let e;
  if (n.md.options.typographer)
    for (e = n.tokens.length - 1; e >= 0; e--)
      n.tokens[e].type === "inline" && (ld.test(n.tokens[e].content) && hd(n.tokens[e].children), Ll.test(n.tokens[e].content) && dd(n.tokens[e].children));
}
const md = /['"]/, Ns = /['"]/g, Fs = "’";
function jn(n, e, t, r) {
  n[e] || (n[e] = []), n[e].push({ pos: t, ch: r });
}
function gd(n, e) {
  let t = "", r = 0;
  e.sort((i, u) => i.pos - u.pos);
  for (let i = 0; i < e.length; i++) {
    const u = e[i];
    t += n.slice(r, u.pos) + u.ch, r = u.pos + 1;
  }
  return t + n.slice(r);
}
function bd(n, e) {
  let t;
  const r = [], i = {};
  for (let u = 0; u < n.length; u++) {
    const s = n[u], o = n[u].level;
    for (t = r.length - 1; t >= 0 && !(r[t].level <= o); t--)
      ;
    if (r.length = t + 1, s.type !== "text")
      continue;
    const l = s.content;
    let a = 0;
    const c = l.length;
    e:
      for (; a < c; ) {
        Ns.lastIndex = a;
        const f = Ns.exec(l);
        if (!f)
          break;
        let d = !0, p = !0;
        a = f.index + 1;
        const h = f[0] === "'";
        let m = 32;
        if (f.index - 1 >= 0)
          m = l.charCodeAt(f.index - 1);
        else
          for (t = u - 1; t >= 0 && !(n[t].type === "softbreak" || n[t].type === "hardbreak"); t--)
            if (n[t].content) {
              m = n[t].content.charCodeAt(n[t].content.length - 1);
              break;
            }
        let g = 32;
        if (a < c)
          g = l.charCodeAt(a);
        else
          for (t = u + 1; t < n.length && !(n[t].type === "softbreak" || n[t].type === "hardbreak"); t++)
            if (n[t].content) {
              g = n[t].content.charCodeAt(0);
              break;
            }
        const b = bn(m) || gn(m), C = bn(g) || gn(g), D = mn(m), A = mn(g);
        if (A ? d = !1 : C && (D || b || (d = !1)), D ? p = !1 : b && (A || C || (p = !1)), g === 34 && f[0] === '"' && m >= 48 && m <= 57 && (p = d = !1), d && p && (d = b, p = C), !d && !p) {
          h && jn(i, u, f.index, Fs);
          continue;
        }
        if (p)
          for (t = r.length - 1; t >= 0; t--) {
            let M = r[t];
            if (r[t].level < o)
              break;
            if (M.single === h && r[t].level === o) {
              M = r[t];
              let O, w;
              h ? (O = e.md.options.quotes[2], w = e.md.options.quotes[3]) : (O = e.md.options.quotes[0], w = e.md.options.quotes[1]), jn(i, u, f.index, w), jn(i, M.token, M.pos, O), r.length = t;
              continue e;
            }
          }
        d ? r.push({
          token: u,
          pos: f.index,
          single: h,
          level: o
        }) : p && h && jn(i, u, f.index, Fs);
      }
  }
  Object.keys(i).forEach(function(u) {
    n[u].content = gd(n[u].content, i[u]);
  });
}
function xd(n) {
  if (n.md.options.typographer)
    for (let e = n.tokens.length - 1; e >= 0; e--)
      n.tokens[e].type !== "inline" || !md.test(n.tokens[e].content) || bd(n.tokens[e].children, n);
}
function yd(n) {
  let e, t;
  const r = n.tokens, i = r.length;
  for (let u = 0; u < i; u++) {
    if (r[u].type !== "inline") continue;
    const s = r[u].children, o = s.length;
    for (e = 0; e < o; e++)
      s[e].type === "text_special" && (s[e].type = "text");
    for (e = t = 0; e < o; e++)
      s[e].type === "text" && e + 1 < o && s[e + 1].type === "text" ? s[e + 1].content = s[e].content + s[e + 1].content : (e !== t && (s[t] = s[e]), t++);
    e !== t && (s.length = t);
  }
}
const ei = [
  ["normalize", nd],
  ["block", rd],
  ["inline", id],
  ["linkify", od],
  ["replacements", pd],
  ["smartquotes", xd],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", yd]
];
function ou() {
  this.ruler = new ie();
  for (let n = 0; n < ei.length; n++)
    this.ruler.push(ei[n][0], ei[n][1]);
}
ou.prototype.process = function(n) {
  const e = this.ruler.getRules("");
  for (let t = 0, r = e.length; t < r; t++)
    e[t](n);
};
ou.prototype.State = zl;
function Ae(n, e, t, r) {
  this.src = n, this.md = e, this.env = t, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
  const i = this.src;
  for (let u = 0, s = 0, o = 0, l = 0, a = i.length, c = !1; s < a; s++) {
    const f = i.charCodeAt(s);
    if (!c)
      if (B(f)) {
        o++, f === 9 ? l += 4 - l % 4 : l++;
        continue;
      } else
        c = !0;
    (f === 10 || s === a - 1) && (f !== 10 && s++, this.bMarks.push(u), this.eMarks.push(s), this.tShift.push(o), this.sCount.push(l), this.bsCount.push(0), c = !1, o = 0, l = 0, u = s + 1);
  }
  this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
Ae.prototype.push = function(n, e, t) {
  const r = new ye(n, e, t);
  return r.block = !0, t < 0 && this.level--, r.level = this.level, t > 0 && this.level++, this.tokens.push(r), r;
};
Ae.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
Ae.prototype.skipEmptyLines = function(e) {
  for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
Ae.prototype.skipSpaces = function(e) {
  for (let t = this.src.length; e < t; e++) {
    const r = this.src.charCodeAt(e);
    if (!B(r))
      break;
  }
  return e;
};
Ae.prototype.skipSpacesBack = function(e, t) {
  if (e <= t)
    return e;
  for (; e > t; )
    if (!B(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
Ae.prototype.skipChars = function(e, t) {
  for (let r = this.src.length; e < r && this.src.charCodeAt(e) === t; e++)
    ;
  return e;
};
Ae.prototype.skipCharsBack = function(e, t, r) {
  if (e <= r)
    return e;
  for (; e > r; )
    if (t !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
Ae.prototype.getLines = function(e, t, r, i) {
  if (e >= t)
    return "";
  const u = new Array(t - e);
  for (let s = 0, o = e; o < t; o++, s++) {
    let l = 0;
    const a = this.bMarks[o];
    let c = a, f;
    for (o + 1 < t || i ? f = this.eMarks[o] + 1 : f = this.eMarks[o]; c < f && l < r; ) {
      const d = this.src.charCodeAt(c);
      if (B(d))
        d === 9 ? l += 4 - (l + this.bsCount[o]) % 4 : l++;
      else if (c - a < this.tShift[o])
        l++;
      else
        break;
      c++;
    }
    l > r ? u[s] = new Array(l - r + 1).join(" ") + this.src.slice(c, f) : u[s] = this.src.slice(c, f);
  }
  return u.join("");
};
Ae.prototype.Token = ye;
const kd = 65536;
function ti(n, e) {
  const t = n.bMarks[e] + n.tShift[e], r = n.eMarks[e];
  return n.src.slice(t, r);
}
function vs(n) {
  const e = [], t = n.length;
  let r = 0, i = n.charCodeAt(r), u = !1, s = 0, o = "";
  for (; r < t; )
    i === 124 && (u ? (o += n.substring(s, r - 1), s = r) : (e.push(o + n.substring(s, r)), o = "", s = r + 1)), u = i === 92, r++, i = n.charCodeAt(r);
  return e.push(o + n.substring(s)), e;
}
function Cd(n, e, t, r) {
  if (e + 2 > t)
    return !1;
  let i = e + 1;
  if (n.sCount[i] < n.blkIndent || n.sCount[i] - n.blkIndent >= 4)
    return !1;
  let u = n.bMarks[i] + n.tShift[i];
  if (u >= n.eMarks[i])
    return !1;
  const s = n.src.charCodeAt(u++);
  if (s !== 124 && s !== 45 && s !== 58 || u >= n.eMarks[i])
    return !1;
  const o = n.src.charCodeAt(u++);
  if (o !== 124 && o !== 45 && o !== 58 && !B(o) || s === 45 && B(o))
    return !1;
  for (; u < n.eMarks[i]; ) {
    const A = n.src.charCodeAt(u);
    if (A !== 124 && A !== 45 && A !== 58 && !B(A))
      return !1;
    u++;
  }
  let l = ti(n, e + 1), a = l.split("|");
  const c = [];
  for (let A = 0; A < a.length; A++) {
    const M = a[A].trim();
    if (!M) {
      if (A === 0 || A === a.length - 1)
        continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(M))
      return !1;
    M.charCodeAt(M.length - 1) === 58 ? c.push(M.charCodeAt(0) === 58 ? "center" : "right") : M.charCodeAt(0) === 58 ? c.push("left") : c.push("");
  }
  if (l = ti(n, e).trim(), l.indexOf("|") === -1 || n.sCount[e] - n.blkIndent >= 4)
    return !1;
  a = vs(l), a.length && a[0] === "" && a.shift(), a.length && a[a.length - 1] === "" && a.pop();
  const f = a.length;
  if (f === 0 || f !== c.length)
    return !1;
  if (r)
    return !0;
  const d = n.parentType;
  n.parentType = "table";
  const p = n.md.block.ruler.getRules("blockquote"), h = n.push("table_open", "table", 1), m = [e, 0];
  h.map = m;
  const g = n.push("thead_open", "thead", 1);
  g.map = [e, e + 1];
  const b = n.push("tr_open", "tr", 1);
  b.map = [e, e + 1];
  for (let A = 0; A < a.length; A++) {
    const M = n.push("th_open", "th", 1);
    c[A] && (M.attrs = [["style", "text-align:" + c[A]]]);
    const O = n.push("inline", "", 0);
    O.content = a[A].trim(), O.children = [], n.push("th_close", "th", -1);
  }
  n.push("tr_close", "tr", -1), n.push("thead_close", "thead", -1);
  let C, D = 0;
  for (i = e + 2; i < t && !(n.sCount[i] < n.blkIndent); i++) {
    let A = !1;
    for (let O = 0, w = p.length; O < w; O++)
      if (p[O](n, i, t, !0)) {
        A = !0;
        break;
      }
    if (A || (l = ti(n, i).trim(), !l) || n.sCount[i] - n.blkIndent >= 4 || (a = vs(l), a.length && a[0] === "" && a.shift(), a.length && a[a.length - 1] === "" && a.pop(), D += f - a.length, D > kd))
      break;
    if (i === e + 2) {
      const O = n.push("tbody_open", "tbody", 1);
      O.map = C = [e + 2, 0];
    }
    const M = n.push("tr_open", "tr", 1);
    M.map = [i, i + 1];
    for (let O = 0; O < f; O++) {
      const w = n.push("td_open", "td", 1);
      c[O] && (w.attrs = [["style", "text-align:" + c[O]]]);
      const F = n.push("inline", "", 0);
      F.content = a[O] ? a[O].trim() : "", F.children = [], n.push("td_close", "td", -1);
    }
    n.push("tr_close", "tr", -1);
  }
  return C && (n.push("tbody_close", "tbody", -1), C[1] = i), n.push("table_close", "table", -1), m[1] = i, n.parentType = d, n.line = i, !0;
}
function Dd(n, e, t) {
  if (n.sCount[e] - n.blkIndent < 4)
    return !1;
  let r = e + 1, i = r;
  for (; r < t; ) {
    if (n.isEmpty(r)) {
      r++;
      continue;
    }
    if (n.sCount[r] - n.blkIndent >= 4) {
      r++, i = r;
      continue;
    }
    break;
  }
  n.line = i;
  const u = n.push("code_block", "code", 0);
  return u.content = n.getLines(e, i, 4 + n.blkIndent, !1) + `
`, u.map = [e, n.line], !0;
}
function Sd(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e];
  if (n.sCount[e] - n.blkIndent >= 4 || i + 3 > u)
    return !1;
  const s = n.src.charCodeAt(i);
  if (s !== 126 && s !== 96)
    return !1;
  let o = i;
  i = n.skipChars(i, s);
  let l = i - o;
  if (l < 3)
    return !1;
  const a = n.src.slice(o, i), c = n.src.slice(i, u);
  if (s === 96 && c.indexOf(String.fromCharCode(s)) >= 0)
    return !1;
  if (r)
    return !0;
  let f = e, d = !1;
  for (; f++, !(f >= t || (i = o = n.bMarks[f] + n.tShift[f], u = n.eMarks[f], i < u && n.sCount[f] < n.blkIndent)); )
    if (n.src.charCodeAt(i) === s && !(n.sCount[f] - n.blkIndent >= 4) && (i = n.skipChars(i, s), !(i - o < l) && (i = n.skipSpaces(i), !(i < u)))) {
      d = !0;
      break;
    }
  l = n.sCount[e], n.line = f + (d ? 1 : 0);
  const p = n.push("fence", "code", 0);
  return p.info = c, p.content = n.getLines(e + 1, f, l, !0), p.markup = a, p.map = [e, n.line], !0;
}
function Ed(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e];
  const s = n.lineMax;
  if (n.sCount[e] - n.blkIndent >= 4 || n.src.charCodeAt(i) !== 62)
    return !1;
  if (r)
    return !0;
  const o = [], l = [], a = [], c = [], f = n.md.block.ruler.getRules("blockquote"), d = n.parentType;
  n.parentType = "blockquote";
  let p = !1, h;
  for (h = e; h < t; h++) {
    const D = n.sCount[h] < n.blkIndent;
    if (i = n.bMarks[h] + n.tShift[h], u = n.eMarks[h], i >= u)
      break;
    if (n.src.charCodeAt(i++) === 62 && !D) {
      let M = n.sCount[h] + 1, O, w;
      n.src.charCodeAt(i) === 32 ? (i++, M++, w = !1, O = !0) : n.src.charCodeAt(i) === 9 ? (O = !0, (n.bsCount[h] + M) % 4 === 3 ? (i++, M++, w = !1) : w = !0) : O = !1;
      let F = M;
      for (o.push(n.bMarks[h]), n.bMarks[h] = i; i < u; ) {
        const P = n.src.charCodeAt(i);
        if (B(P))
          P === 9 ? F += 4 - (F + n.bsCount[h] + (w ? 1 : 0)) % 4 : F++;
        else
          break;
        i++;
      }
      p = i >= u, l.push(n.bsCount[h]), n.bsCount[h] = n.sCount[h] + 1 + (O ? 1 : 0), a.push(n.sCount[h]), n.sCount[h] = F - M, c.push(n.tShift[h]), n.tShift[h] = i - n.bMarks[h];
      continue;
    }
    if (p)
      break;
    let A = !1;
    for (let M = 0, O = f.length; M < O; M++)
      if (f[M](n, h, t, !0)) {
        A = !0;
        break;
      }
    if (A) {
      n.lineMax = h, n.blkIndent !== 0 && (o.push(n.bMarks[h]), l.push(n.bsCount[h]), c.push(n.tShift[h]), a.push(n.sCount[h]), n.sCount[h] -= n.blkIndent);
      break;
    }
    o.push(n.bMarks[h]), l.push(n.bsCount[h]), c.push(n.tShift[h]), a.push(n.sCount[h]), n.sCount[h] = -1;
  }
  const m = n.blkIndent;
  n.blkIndent = 0;
  const g = n.push("blockquote_open", "blockquote", 1);
  g.markup = ">";
  const b = [e, 0];
  g.map = b, n.md.block.tokenize(n, e, h);
  const C = n.push("blockquote_close", "blockquote", -1);
  C.markup = ">", n.lineMax = s, n.parentType = d, b[1] = n.line;
  for (let D = 0; D < c.length; D++)
    n.bMarks[D + e] = o[D], n.tShift[D + e] = c[D], n.sCount[D + e] = a[D], n.bsCount[D + e] = l[D];
  return n.blkIndent = m, !0;
}
function _d(n, e, t, r) {
  const i = n.eMarks[e];
  if (n.sCount[e] - n.blkIndent >= 4)
    return !1;
  let u = n.bMarks[e] + n.tShift[e];
  const s = n.src.charCodeAt(u++);
  if (s !== 42 && s !== 45 && s !== 95)
    return !1;
  let o = 1;
  for (; u < i; ) {
    const a = n.src.charCodeAt(u++);
    if (a !== s && !B(a))
      return !1;
    a === s && o++;
  }
  if (o < 3)
    return !1;
  if (r)
    return !0;
  n.line = e + 1;
  const l = n.push("hr", "hr", 0);
  return l.map = [e, n.line], l.markup = Array(o + 1).join(String.fromCharCode(s)), !0;
}
function Is(n, e) {
  const t = n.eMarks[e];
  let r = n.bMarks[e] + n.tShift[e];
  const i = n.src.charCodeAt(r++);
  if (i !== 42 && i !== 45 && i !== 43)
    return -1;
  if (r < t) {
    const u = n.src.charCodeAt(r);
    if (!B(u))
      return -1;
  }
  return r;
}
function Rs(n, e) {
  const t = n.bMarks[e] + n.tShift[e], r = n.eMarks[e];
  let i = t;
  if (i + 1 >= r)
    return -1;
  let u = n.src.charCodeAt(i++);
  if (u < 48 || u > 57)
    return -1;
  for (; ; ) {
    if (i >= r)
      return -1;
    if (u = n.src.charCodeAt(i++), u >= 48 && u <= 57) {
      if (i - t >= 10)
        return -1;
      continue;
    }
    if (u === 41 || u === 46)
      break;
    return -1;
  }
  return i < r && (u = n.src.charCodeAt(i), !B(u)) ? -1 : i;
}
function wd(n, e) {
  const t = n.level + 2;
  for (let r = e + 2, i = n.tokens.length - 2; r < i; r++)
    n.tokens[r].level === t && n.tokens[r].type === "paragraph_open" && (n.tokens[r + 2].hidden = !0, n.tokens[r].hidden = !0, r += 2);
}
function Ad(n, e, t, r) {
  let i, u, s, o, l = e, a = !0;
  if (n.sCount[l] - n.blkIndent >= 4 || n.listIndent >= 0 && n.sCount[l] - n.listIndent >= 4 && n.sCount[l] < n.blkIndent)
    return !1;
  let c = !1;
  r && n.parentType === "paragraph" && n.sCount[l] >= n.blkIndent && (c = !0);
  let f, d, p;
  if ((p = Rs(n, l)) >= 0) {
    if (f = !0, s = n.bMarks[l] + n.tShift[l], d = Number(n.src.slice(s, p - 1)), c && d !== 1) return !1;
  } else if ((p = Is(n, l)) >= 0)
    f = !1;
  else
    return !1;
  if (c && n.skipSpaces(p) >= n.eMarks[l])
    return !1;
  if (r)
    return !0;
  const h = n.src.charCodeAt(p - 1), m = n.tokens.length;
  f ? (o = n.push("ordered_list_open", "ol", 1), d !== 1 && (o.attrs = [["start", d]])) : o = n.push("bullet_list_open", "ul", 1);
  const g = [l, 0];
  o.map = g, o.markup = String.fromCharCode(h);
  let b = !1;
  const C = n.md.block.ruler.getRules("list"), D = n.parentType;
  for (n.parentType = "list"; l < t; ) {
    u = p, i = n.eMarks[l];
    const A = n.sCount[l] + p - (n.bMarks[l] + n.tShift[l]);
    let M = A;
    for (; u < i; ) {
      const xt = n.src.charCodeAt(u);
      if (xt === 9)
        M += 4 - (M + n.bsCount[l]) % 4;
      else if (xt === 32)
        M++;
      else
        break;
      u++;
    }
    const O = u;
    let w;
    O >= i ? w = 1 : w = M - A, w > 4 && (w = 1);
    const F = A + w;
    o = n.push("list_item_open", "li", 1), o.markup = String.fromCharCode(h);
    const P = [l, 0];
    o.map = P, f && (o.info = n.src.slice(s, p - 1));
    const et = n.tight, Fr = n.tShift[l], xa = n.sCount[l], ya = n.listIndent;
    if (n.listIndent = n.blkIndent, n.blkIndent = F, n.tight = !0, n.tShift[l] = O - n.bMarks[l], n.sCount[l] = M, O >= i && n.isEmpty(l + 1) ? n.line = Math.min(n.line + 2, t) : n.md.block.tokenize(n, l, t, !0), (!n.tight || b) && (a = !1), b = n.line - l > 1 && n.isEmpty(n.line - 1), n.blkIndent = n.listIndent, n.listIndent = ya, n.tShift[l] = Fr, n.sCount[l] = xa, n.tight = et, o = n.push("list_item_close", "li", -1), o.markup = String.fromCharCode(h), l = n.line, P[1] = l, l >= t || n.sCount[l] < n.blkIndent || n.sCount[l] - n.blkIndent >= 4)
      break;
    let fu = !1;
    for (let xt = 0, ka = C.length; xt < ka; xt++)
      if (C[xt](n, l, t, !0)) {
        fu = !0;
        break;
      }
    if (fu)
      break;
    if (f) {
      if (p = Rs(n, l), p < 0)
        break;
      s = n.bMarks[l] + n.tShift[l];
    } else if (p = Is(n, l), p < 0)
      break;
    if (h !== n.src.charCodeAt(p - 1))
      break;
  }
  return f ? o = n.push("ordered_list_close", "ol", -1) : o = n.push("bullet_list_close", "ul", -1), o.markup = String.fromCharCode(h), g[1] = l, n.line = l, n.parentType = D, a && wd(n, m), !0;
}
function Md(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e], s = e + 1;
  if (n.sCount[e] - n.blkIndent >= 4 || n.src.charCodeAt(i) !== 91)
    return !1;
  function o(C) {
    const D = n.lineMax;
    if (C >= D || n.isEmpty(C))
      return null;
    let A = !1;
    if (n.sCount[C] - n.blkIndent > 3 && (A = !0), n.sCount[C] < 0 && (A = !0), !A) {
      const w = n.md.block.ruler.getRules("reference"), F = n.parentType;
      n.parentType = "reference";
      let P = !1;
      for (let et = 0, Fr = w.length; et < Fr; et++)
        if (w[et](n, C, D, !0)) {
          P = !0;
          break;
        }
      if (n.parentType = F, P)
        return null;
    }
    const M = n.bMarks[C] + n.tShift[C], O = n.eMarks[C];
    return n.src.slice(M, O + 1);
  }
  let l = n.src.slice(i, u + 1);
  u = l.length;
  let a = -1;
  for (i = 1; i < u; i++) {
    const C = l.charCodeAt(i);
    if (C === 91)
      return !1;
    if (C === 93) {
      a = i;
      break;
    } else if (C === 10) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    } else if (C === 92 && (i++, i < u && l.charCodeAt(i) === 10)) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    }
  }
  if (a < 0 || l.charCodeAt(a + 1) !== 58)
    return !1;
  for (i = a + 2; i < u; i++) {
    const C = l.charCodeAt(i);
    if (C === 10) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    } else if (!B(C)) break;
  }
  const c = n.md.helpers.parseLinkDestination(l, i, u);
  if (!c.ok)
    return !1;
  const f = n.md.normalizeLink(c.str);
  if (!n.md.validateLink(f))
    return !1;
  i = c.pos;
  const d = i, p = s, h = i;
  for (; i < u; i++) {
    const C = l.charCodeAt(i);
    if (C === 10) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    } else if (!B(C)) break;
  }
  let m = n.md.helpers.parseLinkTitle(l, i, u);
  for (; m.can_continue; ) {
    const C = o(s);
    if (C === null) break;
    l += C, i = u, u = l.length, s++, m = n.md.helpers.parseLinkTitle(l, i, u, m);
  }
  let g;
  for (i < u && h !== i && m.ok ? (g = m.str, i = m.pos) : (g = "", i = d, s = p); i < u; ) {
    const C = l.charCodeAt(i);
    if (!B(C))
      break;
    i++;
  }
  if (i < u && l.charCodeAt(i) !== 10 && g)
    for (g = "", i = d, s = p; i < u; ) {
      const C = l.charCodeAt(i);
      if (!B(C))
        break;
      i++;
    }
  if (i < u && l.charCodeAt(i) !== 10)
    return !1;
  const b = Ar(l.slice(1, a));
  return b ? (r || (typeof n.env.references > "u" && (n.env.references = {}), typeof n.env.references[b] > "u" && (n.env.references[b] = { title: g, href: f }), n.line = s), !0) : !1;
}
const Td = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], Od = "[a-zA-Z_:][a-zA-Z0-9:._-]*", Nd = "[^\"'=<>`\\x00-\\x20]+", Fd = "'[^']*'", vd = '"[^"]*"', Id = "(?:" + Nd + "|" + Fd + "|" + vd + ")", Rd = "(?:\\s+" + Od + "(?:\\s*=\\s*" + Id + ")?)", Vl = "<[A-Za-z][A-Za-z0-9\\-]*" + Rd + "*\\s*\\/?>", ql = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", Bd = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->", $d = "<[?][\\s\\S]*?[?]>", Pd = "<![A-Za-z][^>]*>", zd = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", Ld = new RegExp("^(?:" + Vl + "|" + ql + "|" + Bd + "|" + $d + "|" + Pd + "|" + zd + ")"), Vd = new RegExp("^(?:" + Vl + "|" + ql + ")"), nt = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + Td.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(Vd.source + "\\s*$"), /^$/, !1]
];
function qd(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e];
  if (n.sCount[e] - n.blkIndent >= 4 || !n.md.options.html || n.src.charCodeAt(i) !== 60)
    return !1;
  let s = n.src.slice(i, u), o = 0;
  for (; o < nt.length && !nt[o][0].test(s); o++)
    ;
  if (o === nt.length)
    return !1;
  if (r)
    return nt[o][2];
  let l = e + 1;
  const a = nt[o][1].test("");
  if (!nt[o][1].test(s)) {
    for (; l < t && !(n.sCount[l] < n.blkIndent && (a || !n.isEmpty(l))); l++)
      if (i = n.bMarks[l] + n.tShift[l], u = n.eMarks[l], s = n.src.slice(i, u), nt[o][1].test(s)) {
        s.length !== 0 && l++;
        break;
      }
  }
  n.line = l;
  const c = n.push("html_block", "", 0);
  return c.map = [e, l], c.content = n.getLines(e, l, n.blkIndent, !0), !0;
}
function Hd(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e];
  if (n.sCount[e] - n.blkIndent >= 4)
    return !1;
  let s = n.src.charCodeAt(i);
  if (s !== 35 || i >= u)
    return !1;
  let o = 1;
  for (s = n.src.charCodeAt(++i); s === 35 && i < u && o <= 6; )
    o++, s = n.src.charCodeAt(++i);
  if (o > 6 || i < u && !B(s))
    return !1;
  if (r)
    return !0;
  u = n.skipSpacesBack(u, i);
  const l = n.skipCharsBack(u, 35, i);
  l > i && B(n.src.charCodeAt(l - 1)) && (u = l), n.line = e + 1;
  const a = n.push("heading_open", "h" + String(o), 1);
  a.markup = "########".slice(0, o), a.map = [e, n.line];
  const c = n.push("inline", "", 0);
  c.content = Mr(n.src.slice(i, u)), c.map = [e, n.line], c.children = [];
  const f = n.push("heading_close", "h" + String(o), -1);
  return f.markup = "########".slice(0, o), !0;
}
function Ud(n, e, t) {
  const r = n.md.block.ruler.getRules("paragraph");
  if (n.sCount[e] - n.blkIndent >= 4)
    return !1;
  const i = n.parentType;
  n.parentType = "paragraph";
  let u = 0, s, o = e + 1;
  for (; o < t && !n.isEmpty(o); o++) {
    if (n.sCount[o] - n.blkIndent > 3)
      continue;
    if (n.sCount[o] >= n.blkIndent) {
      let p = n.bMarks[o] + n.tShift[o];
      const h = n.eMarks[o];
      if (p < h && (s = n.src.charCodeAt(p), (s === 45 || s === 61) && (p = n.skipChars(p, s), p = n.skipSpaces(p), p >= h))) {
        u = s === 61 ? 1 : 2;
        break;
      }
    }
    if (n.sCount[o] < 0)
      continue;
    let d = !1;
    for (let p = 0, h = r.length; p < h; p++)
      if (r[p](n, o, t, !0)) {
        d = !0;
        break;
      }
    if (d)
      break;
  }
  if (!u)
    return n.parentType = i, !1;
  const l = Mr(n.getLines(e, o, n.blkIndent, !1));
  n.line = o + 1;
  const a = n.push("heading_open", "h" + String(u), 1);
  a.markup = String.fromCharCode(s), a.map = [e, n.line];
  const c = n.push("inline", "", 0);
  c.content = l, c.map = [e, n.line - 1], c.children = [];
  const f = n.push("heading_close", "h" + String(u), -1);
  return f.markup = String.fromCharCode(s), n.parentType = i, !0;
}
function Wd(n, e, t) {
  const r = n.md.block.ruler.getRules("paragraph"), i = n.parentType;
  let u = e + 1;
  for (n.parentType = "paragraph"; u < t && !n.isEmpty(u); u++) {
    if (n.sCount[u] - n.blkIndent > 3 || n.sCount[u] < 0)
      continue;
    let a = !1;
    for (let c = 0, f = r.length; c < f; c++)
      if (r[c](n, u, t, !0)) {
        a = !0;
        break;
      }
    if (a)
      break;
  }
  const s = Mr(n.getLines(e, u, n.blkIndent, !1));
  n.line = u;
  const o = n.push("paragraph_open", "p", 1);
  o.map = [e, n.line];
  const l = n.push("inline", "", 0);
  return l.content = s, l.map = [e, n.line], l.children = [], n.push("paragraph_close", "p", -1), n.parentType = i, !0;
}
const Jn = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", Cd, ["paragraph", "reference"]],
  ["code", Dd],
  ["fence", Sd, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", Ed, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", _d, ["paragraph", "reference", "blockquote", "list"]],
  ["list", Ad, ["paragraph", "reference", "blockquote"]],
  ["reference", Md],
  ["html_block", qd, ["paragraph", "reference", "blockquote"]],
  ["heading", Hd, ["paragraph", "reference", "blockquote"]],
  ["lheading", Ud],
  ["paragraph", Wd]
];
function Tr() {
  this.ruler = new ie();
  for (let n = 0; n < Jn.length; n++)
    this.ruler.push(Jn[n][0], Jn[n][1], { alt: (Jn[n][2] || []).slice() });
}
Tr.prototype.tokenize = function(n, e, t) {
  const r = this.ruler.getRules(""), i = r.length, u = n.md.options.maxNesting;
  let s = e, o = !1;
  for (; s < t && (n.line = s = n.skipEmptyLines(s), !(s >= t || n.sCount[s] < n.blkIndent)); ) {
    if (n.level >= u) {
      n.line = t;
      break;
    }
    const l = n.line;
    let a = !1;
    for (let c = 0; c < i; c++)
      if (a = r[c](n, s, t, !1), a) {
        if (l >= n.line)
          throw new Error("block rule didn't increment state.line");
        break;
      }
    if (!a) throw new Error("none of the block rules matched");
    n.tight = !o, n.isEmpty(n.line - 1) && (o = !0), s = n.line, s < t && n.isEmpty(s) && (o = !0, s++, n.line = s);
  }
};
Tr.prototype.parse = function(n, e, t, r) {
  if (!n)
    return;
  const i = new this.State(n, e, t, r);
  this.tokenize(i, i.line, i.lineMax);
};
Tr.prototype.State = Ae;
function Pn(n, e, t, r) {
  this.src = n, this.env = t, this.md = e, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
Pn.prototype.pushPending = function() {
  const n = new ye("text", "", 0);
  return n.content = this.pending, n.level = this.pendingLevel, this.tokens.push(n), this.pending = "", n;
};
Pn.prototype.push = function(n, e, t) {
  this.pending && this.pushPending();
  const r = new ye(n, e, t);
  let i = null;
  return t < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, t > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
};
Pn.prototype.scanDelims = function(n, e) {
  const t = this.posMax, r = this.src.charCodeAt(n);
  let i;
  if (n === 0)
    i = 32;
  else if (n === 1)
    i = this.src.charCodeAt(0), (i & 63488) === 55296 && (i = 65533);
  else if (i = this.src.charCodeAt(n - 1), (i & 64512) === 56320) {
    const g = this.src.charCodeAt(n - 2);
    i = (g & 64512) === 55296 ? 65536 + (g - 55296 << 10) + (i - 56320) : 65533;
  } else (i & 64512) === 55296 && (i = 65533);
  let u = n;
  for (; u < t && this.src.charCodeAt(u) === r; )
    u++;
  const s = u - n;
  let o = u < t ? this.src.charCodeAt(u) : 32;
  if ((o & 64512) === 55296) {
    const g = this.src.charCodeAt(u + 1);
    o = (g & 64512) === 56320 ? 65536 + (o - 55296 << 10) + (g - 56320) : 65533;
  } else (o & 64512) === 56320 && (o = 65533);
  const l = bn(i) || gn(i), a = bn(o) || gn(o), c = mn(i), f = mn(o), d = !f && (!a || c || l), p = !c && (!l || f || a);
  return { can_open: d && (e || !p || l), can_close: p && (e || !d || a), length: s };
};
Pn.prototype.Token = ye;
function jd(n) {
  switch (n) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function Jd(n, e) {
  let t = n.pos;
  for (; t < n.posMax && !jd(n.src.charCodeAt(t)); )
    t++;
  return t === n.pos ? !1 : (e || (n.pending += n.src.slice(n.pos, t)), n.pos = t, !0);
}
const Kd = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function Zd(n, e) {
  if (!n.md.options.linkify || n.linkLevel > 0) return !1;
  const t = n.pos, r = n.posMax;
  if (t + 3 > r || n.src.charCodeAt(t) !== 58 || n.src.charCodeAt(t + 1) !== 47 || n.src.charCodeAt(t + 2) !== 47) return !1;
  const i = n.pending.match(Kd);
  if (!i) return !1;
  const u = i[1], s = n.md.linkify.matchAtStart(n.src.slice(t - u.length));
  if (!s) return !1;
  let o = s.url;
  if (o.length <= u.length) return !1;
  let l = o.length;
  for (; l > 0 && o.charCodeAt(l - 1) === 42; )
    l--;
  l !== o.length && (o = o.slice(0, l));
  const a = n.md.normalizeLink(o);
  if (!n.md.validateLink(a)) return !1;
  if (!e) {
    n.pending = n.pending.slice(0, -u.length);
    const c = n.push("link_open", "a", 1);
    c.attrs = [["href", a]], c.markup = "linkify", c.info = "auto";
    const f = n.push("text", "", 0);
    f.content = n.md.normalizeLinkText(o);
    const d = n.push("link_close", "a", -1);
    d.markup = "linkify", d.info = "auto";
  }
  return n.pos += o.length - u.length, !0;
}
function Gd(n, e) {
  let t = n.pos;
  if (n.src.charCodeAt(t) !== 10)
    return !1;
  const r = n.pending.length - 1, i = n.posMax;
  if (!e)
    if (r >= 0 && n.pending.charCodeAt(r) === 32)
      if (r >= 1 && n.pending.charCodeAt(r - 1) === 32) {
        let u = r - 1;
        for (; u >= 1 && n.pending.charCodeAt(u - 1) === 32; ) u--;
        n.pending = n.pending.slice(0, u), n.push("hardbreak", "br", 0);
      } else
        n.pending = n.pending.slice(0, -1), n.push("softbreak", "br", 0);
    else
      n.push("softbreak", "br", 0);
  for (t++; t < i && B(n.src.charCodeAt(t)); )
    t++;
  return n.pos = t, !0;
}
const lu = [];
for (let n = 0; n < 256; n++)
  lu.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(n) {
  lu[n.charCodeAt(0)] = 1;
});
function Yd(n, e) {
  let t = n.pos;
  const r = n.posMax;
  if (n.src.charCodeAt(t) !== 92 || (t++, t >= r)) return !1;
  let i = n.src.charCodeAt(t);
  if (i === 10) {
    for (e || n.push("hardbreak", "br", 0), t++; t < r && (i = n.src.charCodeAt(t), !!B(i)); )
      t++;
    return n.pos = t, !0;
  }
  if (i === 32) {
    if (!e) {
      const o = n.push("text_special", "", 0);
      o.content = "\\", o.markup = "\\", o.info = "escape";
    }
    return n.pos = t, !0;
  }
  let u = n.src[t];
  if (i >= 55296 && i <= 56319 && t + 1 < r) {
    const o = n.src.charCodeAt(t + 1);
    o >= 56320 && o <= 57343 && (u += n.src[t + 1], t++);
  }
  const s = "\\" + u;
  if (!e) {
    const o = n.push("text_special", "", 0);
    i < 256 && lu[i] !== 0 ? o.content = u : o.content = s, o.markup = s, o.info = "escape";
  }
  return n.pos = t + 1, !0;
}
function Xd(n, e) {
  let t = n.pos;
  if (n.src.charCodeAt(t) !== 96)
    return !1;
  const i = t;
  t++;
  const u = n.posMax;
  for (; t < u && n.src.charCodeAt(t) === 96; )
    t++;
  const s = n.src.slice(i, t), o = s.length;
  if (n.backticksScanned && (n.backticks[o] || 0) <= i)
    return e || (n.pending += s), n.pos += o, !0;
  let l = t, a;
  for (; (a = n.src.indexOf("`", l)) !== -1; ) {
    for (l = a + 1; l < u && n.src.charCodeAt(l) === 96; )
      l++;
    const c = l - a;
    if (c === o) {
      if (!e) {
        const f = n.push("code_inline", "code", 0);
        f.markup = s, f.content = n.src.slice(t, a).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
      }
      return n.pos = l, !0;
    }
    n.backticks[c] = a;
  }
  return n.backticksScanned = !0, e || (n.pending += s), n.pos += o, !0;
}
function Qd(n, e) {
  const t = n.pos, r = n.src.charCodeAt(t);
  if (e || r !== 126)
    return !1;
  const i = n.scanDelims(n.pos, !0);
  let u = i.length;
  const s = String.fromCharCode(r);
  if (u < 2)
    return !1;
  let o;
  u % 2 && (o = n.push("text", "", 0), o.content = s, u--);
  for (let l = 0; l < u; l += 2)
    o = n.push("text", "", 0), o.content = s + s, n.delimiters.push({
      marker: r,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: n.tokens.length - 1,
      end: -1,
      open: i.can_open,
      close: i.can_close
    });
  return n.pos += i.length, !0;
}
function Bs(n, e) {
  let t;
  const r = [], i = e.length;
  for (let u = 0; u < i; u++) {
    const s = e[u];
    if (s.marker !== 126 || s.end === -1)
      continue;
    const o = e[s.end];
    t = n.tokens[s.token], t.type = "s_open", t.tag = "s", t.nesting = 1, t.markup = "~~", t.content = "", t = n.tokens[o.token], t.type = "s_close", t.tag = "s", t.nesting = -1, t.markup = "~~", t.content = "", n.tokens[o.token - 1].type === "text" && n.tokens[o.token - 1].content === "~" && r.push(o.token - 1);
  }
  for (; r.length; ) {
    const u = r.pop();
    let s = u + 1;
    for (; s < n.tokens.length && n.tokens[s].type === "s_close"; )
      s++;
    s--, u !== s && (t = n.tokens[s], n.tokens[s] = n.tokens[u], n.tokens[u] = t);
  }
}
function ep(n) {
  const e = n.tokens_meta, t = n.tokens_meta.length;
  Bs(n, n.delimiters);
  for (let r = 0; r < t; r++)
    e[r] && e[r].delimiters && Bs(n, e[r].delimiters);
}
const Hl = {
  tokenize: Qd,
  postProcess: ep
};
function tp(n, e) {
  const t = n.pos, r = n.src.charCodeAt(t);
  if (e || r !== 95 && r !== 42)
    return !1;
  const i = n.scanDelims(n.pos, r === 42);
  for (let u = 0; u < i.length; u++) {
    const s = n.push("text", "", 0);
    s.content = String.fromCharCode(r), n.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: r,
      // Total length of these series of delimiters.
      //
      length: i.length,
      // A position of the token this delimiter corresponds to.
      //
      token: n.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: i.can_open,
      close: i.can_close
    });
  }
  return n.pos += i.length, !0;
}
function $s(n, e) {
  const t = e.length;
  for (let r = t - 1; r >= 0; r--) {
    const i = e[r];
    if (i.marker !== 95 && i.marker !== 42 || i.end === -1)
      continue;
    const u = e[i.end], s = r > 0 && e[r - 1].end === i.end + 1 && // check that first two markers match and adjacent
    e[r - 1].marker === i.marker && e[r - 1].token === i.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    e[i.end + 1].token === u.token + 1, o = String.fromCharCode(i.marker), l = n.tokens[i.token];
    l.type = s ? "strong_open" : "em_open", l.tag = s ? "strong" : "em", l.nesting = 1, l.markup = s ? o + o : o, l.content = "";
    const a = n.tokens[u.token];
    a.type = s ? "strong_close" : "em_close", a.tag = s ? "strong" : "em", a.nesting = -1, a.markup = s ? o + o : o, a.content = "", s && (n.tokens[e[r - 1].token].content = "", n.tokens[e[i.end + 1].token].content = "", r--);
  }
}
function np(n) {
  const e = n.tokens_meta, t = n.tokens_meta.length;
  $s(n, n.delimiters);
  for (let r = 0; r < t; r++)
    e[r] && e[r].delimiters && $s(n, e[r].delimiters);
}
const Ul = {
  tokenize: tp,
  postProcess: np
};
function rp(n, e) {
  let t, r, i, u, s = "", o = "", l = n.pos, a = !0;
  if (n.src.charCodeAt(n.pos) !== 91)
    return !1;
  const c = n.pos, f = n.posMax, d = n.pos + 1, p = n.md.helpers.parseLinkLabel(n, n.pos, !0);
  if (p < 0)
    return !1;
  let h = p + 1;
  if (h < f && n.src.charCodeAt(h) === 40) {
    for (a = !1, h++; h < f && (t = n.src.charCodeAt(h), !(!B(t) && t !== 10)); h++)
      ;
    if (h >= f)
      return !1;
    if (l = h, i = n.md.helpers.parseLinkDestination(n.src, h, n.posMax), i.ok) {
      for (s = n.md.normalizeLink(i.str), n.md.validateLink(s) ? h = i.pos : s = "", l = h; h < f && (t = n.src.charCodeAt(h), !(!B(t) && t !== 10)); h++)
        ;
      if (i = n.md.helpers.parseLinkTitle(n.src, h, n.posMax), h < f && l !== h && i.ok)
        for (o = i.str, h = i.pos; h < f && (t = n.src.charCodeAt(h), !(!B(t) && t !== 10)); h++)
          ;
    }
    (h >= f || n.src.charCodeAt(h) !== 41) && (a = !0), h++;
  }
  if (a) {
    if (typeof n.env.references > "u")
      return !1;
    if (h < f && n.src.charCodeAt(h) === 91 ? (l = h + 1, h = n.md.helpers.parseLinkLabel(n, h), h >= 0 ? r = n.src.slice(l, h++) : h = p + 1) : h = p + 1, r || (r = n.src.slice(d, p)), u = n.env.references[Ar(r)], !u)
      return n.pos = c, !1;
    s = u.href, o = u.title;
  }
  if (!e) {
    n.pos = d, n.posMax = p;
    const m = n.push("link_open", "a", 1), g = [["href", s]];
    m.attrs = g, o && g.push(["title", o]), n.linkLevel++, n.md.inline.tokenize(n), n.linkLevel--, n.push("link_close", "a", -1);
  }
  return n.pos = h, n.posMax = f, !0;
}
function ip(n, e) {
  let t, r, i, u, s, o, l, a, c = "";
  const f = n.pos, d = n.posMax;
  if (n.src.charCodeAt(n.pos) !== 33 || n.src.charCodeAt(n.pos + 1) !== 91)
    return !1;
  const p = n.pos + 2, h = n.md.helpers.parseLinkLabel(n, n.pos + 1, !1);
  if (h < 0)
    return !1;
  if (u = h + 1, u < d && n.src.charCodeAt(u) === 40) {
    for (u++; u < d && (t = n.src.charCodeAt(u), !(!B(t) && t !== 10)); u++)
      ;
    if (u >= d)
      return !1;
    for (a = u, o = n.md.helpers.parseLinkDestination(n.src, u, n.posMax), o.ok && (c = n.md.normalizeLink(o.str), n.md.validateLink(c) ? u = o.pos : c = ""), a = u; u < d && (t = n.src.charCodeAt(u), !(!B(t) && t !== 10)); u++)
      ;
    if (o = n.md.helpers.parseLinkTitle(n.src, u, n.posMax), u < d && a !== u && o.ok)
      for (l = o.str, u = o.pos; u < d && (t = n.src.charCodeAt(u), !(!B(t) && t !== 10)); u++)
        ;
    else
      l = "";
    if (u >= d || n.src.charCodeAt(u) !== 41)
      return n.pos = f, !1;
    u++;
  } else {
    if (typeof n.env.references > "u")
      return !1;
    if (u < d && n.src.charCodeAt(u) === 91 ? (a = u + 1, u = n.md.helpers.parseLinkLabel(n, u), u >= 0 ? i = n.src.slice(a, u++) : u = h + 1) : u = h + 1, i || (i = n.src.slice(p, h)), s = n.env.references[Ar(i)], !s)
      return n.pos = f, !1;
    c = s.href, l = s.title;
  }
  if (!e) {
    r = n.src.slice(p, h);
    const m = [];
    n.md.inline.parse(
      r,
      n.md,
      n.env,
      m
    );
    const g = n.push("image", "img", 0), b = [["src", c], ["alt", ""]];
    g.attrs = b, g.children = m, g.content = r, l && b.push(["title", l]);
  }
  return n.pos = u, n.posMax = d, !0;
}
const up = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, sp = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function op(n, e) {
  let t = n.pos;
  if (n.src.charCodeAt(t) !== 60)
    return !1;
  const r = n.pos, i = n.posMax;
  for (; ; ) {
    if (++t >= i) return !1;
    const s = n.src.charCodeAt(t);
    if (s === 60) return !1;
    if (s === 62) break;
  }
  const u = n.src.slice(r + 1, t);
  if (sp.test(u)) {
    const s = n.md.normalizeLink(u);
    if (!n.md.validateLink(s))
      return !1;
    if (!e) {
      const o = n.push("link_open", "a", 1);
      o.attrs = [["href", s]], o.markup = "autolink", o.info = "auto";
      const l = n.push("text", "", 0);
      l.content = n.md.normalizeLinkText(u);
      const a = n.push("link_close", "a", -1);
      a.markup = "autolink", a.info = "auto";
    }
    return n.pos += u.length + 2, !0;
  }
  if (up.test(u)) {
    const s = n.md.normalizeLink("mailto:" + u);
    if (!n.md.validateLink(s))
      return !1;
    if (!e) {
      const o = n.push("link_open", "a", 1);
      o.attrs = [["href", s]], o.markup = "autolink", o.info = "auto";
      const l = n.push("text", "", 0);
      l.content = n.md.normalizeLinkText(u);
      const a = n.push("link_close", "a", -1);
      a.markup = "autolink", a.info = "auto";
    }
    return n.pos += u.length + 2, !0;
  }
  return !1;
}
function lp(n) {
  return /^<a[>\s]/i.test(n);
}
function ap(n) {
  return /^<\/a\s*>/i.test(n);
}
function cp(n) {
  const e = n | 32;
  return e >= 97 && e <= 122;
}
function fp(n, e) {
  if (!n.md.options.html)
    return !1;
  const t = n.posMax, r = n.pos;
  if (n.src.charCodeAt(r) !== 60 || r + 2 >= t)
    return !1;
  const i = n.src.charCodeAt(r + 1);
  if (i !== 33 && i !== 63 && i !== 47 && !cp(i))
    return !1;
  const u = n.src.slice(r).match(Ld);
  if (!u)
    return !1;
  if (!e) {
    const s = n.push("html_inline", "", 0);
    s.content = u[0], lp(s.content) && n.linkLevel++, ap(s.content) && n.linkLevel--;
  }
  return n.pos += u[0].length, !0;
}
const hp = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, dp = /^&([a-z][a-z0-9]{1,31});/i;
function pp(n, e) {
  const t = n.pos, r = n.posMax;
  if (n.src.charCodeAt(t) !== 38 || t + 1 >= r) return !1;
  if (n.src.charCodeAt(t + 1) === 35) {
    const u = n.src.slice(t).match(hp);
    if (u) {
      if (!e) {
        const s = u[1][0].toLowerCase() === "x" ? parseInt(u[1].slice(1), 16) : parseInt(u[1], 10), o = n.push("text_special", "", 0);
        o.content = su(s) ? pn(s) : pn(65533), o.markup = u[0], o.info = "entity";
      }
      return n.pos += u[0].length, !0;
    }
  } else {
    const u = n.src.slice(t).match(dp);
    if (u) {
      const s = vh(u[0]);
      if (s !== u[0]) {
        if (!e) {
          const o = n.push("text_special", "", 0);
          o.content = s, o.markup = u[0], o.info = "entity";
        }
        return n.pos += u[0].length, !0;
      }
    }
  }
  return !1;
}
function Ps(n) {
  const e = {}, t = n.length;
  if (!t) return;
  let r = 0, i = -2;
  const u = [];
  for (let s = 0; s < t; s++) {
    const o = n[s];
    if (u.push(0), (n[r].marker !== o.marker || i !== o.token - 1) && (r = s), i = o.token, o.length = o.length || 0, !o.close) continue;
    e.hasOwnProperty(o.marker) || (e[o.marker] = [-1, -1, -1, -1, -1, -1]);
    const l = e[o.marker][(o.open ? 3 : 0) + o.length % 3];
    let a = r - u[r] - 1, c = a;
    for (; a > l; a -= u[a] + 1) {
      const f = n[a];
      if (f.marker === o.marker && f.open && f.end < 0) {
        let d = !1;
        if ((f.close || o.open) && (f.length + o.length) % 3 === 0 && (f.length % 3 !== 0 || o.length % 3 !== 0) && (d = !0), !d) {
          const p = a > 0 && !n[a - 1].open ? u[a - 1] + 1 : 0;
          u[s] = s - a + p, u[a] = p, o.open = !1, f.end = s, f.close = !1, c = -1, i = -2;
          break;
        }
      }
    }
    c !== -1 && (e[o.marker][(o.open ? 3 : 0) + (o.length || 0) % 3] = c);
  }
}
function mp(n) {
  const e = n.tokens_meta, t = n.tokens_meta.length;
  Ps(n.delimiters);
  for (let r = 0; r < t; r++)
    e[r] && e[r].delimiters && Ps(e[r].delimiters);
}
function gp(n) {
  let e, t, r = 0;
  const i = n.tokens, u = n.tokens.length;
  for (e = t = 0; e < u; e++)
    i[e].nesting < 0 && r--, i[e].level = r, i[e].nesting > 0 && r++, i[e].type === "text" && e + 1 < u && i[e + 1].type === "text" ? i[e + 1].content = i[e].content + i[e + 1].content : (e !== t && (i[t] = i[e]), t++);
  e !== t && (i.length = t);
}
const ni = [
  ["text", Jd],
  ["linkify", Zd],
  ["newline", Gd],
  ["escape", Yd],
  ["backticks", Xd],
  ["strikethrough", Hl.tokenize],
  ["emphasis", Ul.tokenize],
  ["link", rp],
  ["image", ip],
  ["autolink", op],
  ["html_inline", fp],
  ["entity", pp]
], ri = [
  ["balance_pairs", mp],
  ["strikethrough", Hl.postProcess],
  ["emphasis", Ul.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", gp]
];
function zn() {
  this.ruler = new ie();
  for (let n = 0; n < ni.length; n++)
    this.ruler.push(ni[n][0], ni[n][1]);
  this.ruler2 = new ie();
  for (let n = 0; n < ri.length; n++)
    this.ruler2.push(ri[n][0], ri[n][1]);
}
zn.prototype.skipToken = function(n) {
  const e = n.pos, t = this.ruler.getRules(""), r = t.length, i = n.md.options.maxNesting, u = n.cache;
  if (typeof u[e] < "u") {
    n.pos = u[e];
    return;
  }
  let s = !1;
  if (n.level < i) {
    for (let o = 0; o < r; o++)
      if (n.level++, s = t[o](n, !0), n.level--, s) {
        if (e >= n.pos)
          throw new Error("inline rule didn't increment state.pos");
        break;
      }
  } else
    n.pos = n.posMax;
  s || n.pos++, u[e] = n.pos;
};
zn.prototype.tokenize = function(n) {
  const e = this.ruler.getRules(""), t = e.length, r = n.posMax, i = n.md.options.maxNesting;
  for (; n.pos < r; ) {
    const u = n.pos;
    let s = !1;
    if (n.level < i) {
      for (let o = 0; o < t; o++)
        if (s = e[o](n, !1), s) {
          if (u >= n.pos)
            throw new Error("inline rule didn't increment state.pos");
          break;
        }
    }
    if (s) {
      if (n.pos >= r)
        break;
      continue;
    }
    n.pending += n.src[n.pos++];
  }
  n.pending && n.pushPending();
};
zn.prototype.parse = function(n, e, t, r) {
  const i = new this.State(n, e, t, r);
  this.tokenize(i);
  const u = this.ruler2.getRules(""), s = u.length;
  for (let o = 0; o < s; o++)
    u[o](i);
};
zn.prototype.State = Pn;
function bp(n) {
  const e = {};
  n = n || {}, e.src_Any = Ol.source, e.src_Cc = Nl.source, e.src_Z = vl.source, e.src_P = iu.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
  const t = "[><｜]";
  return e.src_pseudo_letter = `(?:(?!${t}|${e.src_ZPCc})${e.src_Any})`, e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = `(?:(?:(?!${e.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`, e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = `(?=$|${t}|${e.src_ZPCc})(?!${n["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${e.src_ZPCc}))`, e.src_path = `(?:[/?#](?:(?!${e.src_ZCc}|${t}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${e.src_ZCc}|\\]).)*\\]|\\((?:(?!${e.src_ZCc}|[)]).)*\\)|\\{(?:(?!${e.src_ZCc}|[}]).)*\\}|\\"(?:(?!${e.src_ZCc}|["]).)+\\"|\\'(?:(?!${e.src_ZCc}|[']).)+\\'|\\'(?=${e.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${e.src_ZCc}|[.]|$)|` + (n["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  `,(?!${e.src_ZCc}|$)|;(?!${e.src_ZCc}|$)|\\!+(?!${e.src_ZCc}|[!]|$)|\\?(?!${e.src_ZCc}|[?]|$))+|\\/)?`, e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]{0,63}', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + e.src_xn + `|${e.src_pseudo_letter}{1,63})`, e.src_domain = "(?:" + e.src_xn + `|(?:${e.src_pseudo_letter})|(?:${e.src_pseudo_letter}(?:-|${e.src_pseudo_letter}){0,61}${e.src_pseudo_letter}))`, e.src_host = `(?:(?:(?:(?:${e.src_domain})\\.)*${e.src_domain}))`, e.tpl_host_fuzzy = "(?:" + e.src_ip4 + `|(?:(?:(?:${e.src_domain})\\.)+(?:%TLDS%)))`, e.tpl_host_no_ip_fuzzy = `(?:(?:(?:${e.src_domain})\\.)+(?:%TLDS%))`, e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${e.src_ZPCc}|>|$))`, e.tpl_email_fuzzy = `(^|${t}|"|\\(|${e.src_ZCc})(${e.src_email_name}@${e.tpl_host_fuzzy_strict})`, e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  `(^|(?![.:/\\-_@])(?:[$+<=>^\`|｜]|${e.src_ZPCc}))((?![$+<=>^\`|｜])${e.tpl_host_port_fuzzy_strict}${e.src_path})`, e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  `(^|(?![.:/\\-_@])(?:[$+<=>^\`|｜]|${e.src_ZPCc}))((?![$+<=>^\`|｜])${e.tpl_host_port_no_ip_fuzzy_strict}${e.src_path})`, e;
}
function wi(n) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
    t && Object.keys(t).forEach(function(r) {
      n[r] = t[r];
    });
  }), n;
}
function Or(n) {
  return Object.prototype.toString.call(n);
}
function xp(n) {
  return Or(n) === "[object String]";
}
function yp(n) {
  return Or(n) === "[object Object]";
}
function kp(n) {
  return Or(n) === "[object RegExp]";
}
function zs(n) {
  return Or(n) === "[object Function]";
}
function Cp(n) {
  return n.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
const Wl = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function Dp(n) {
  return Object.keys(n || {}).reduce(function(e, t) {
    return e || Wl.hasOwnProperty(t);
  }, !1);
}
const Sp = {
  "http:": {
    validate: function(n, e, t) {
      const r = n.slice(e);
      return t.re.http || (t.re.http = new RegExp(
        `^\\/\\/${t.re.src_auth}${t.re.src_host_port_strict}${t.re.src_path}`,
        "i"
      )), t.re.http.test(r) ? r.match(t.re.http)[0].length : 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(n, e, t) {
      const r = n.slice(e);
      return t.re.no_http || (t.re.no_http = new RegExp(
        "^" + t.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
        // with code comments
        `(?:localhost|(?:(?:${t.re.src_domain})\\.)+${t.re.src_domain_root})` + t.re.src_port + t.re.src_host_terminator + t.re.src_path,
        "i"
      )), t.re.no_http.test(r) ? e >= 3 && n[e - 3] === ":" || e >= 3 && n[e - 3] === "/" ? 0 : r.match(t.re.no_http)[0].length : 0;
    }
  },
  "mailto:": {
    validate: function(n, e, t) {
      const r = n.slice(e);
      return t.re.mailto || (t.re.mailto = new RegExp(
        `^${t.re.src_email_name}@${t.re.src_host_strict}`,
        "i"
      )), t.re.mailto.test(r) ? r.match(t.re.mailto)[0].length : 0;
    }
  }
}, Ep = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", _p = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function wp(n) {
  return function(e, t) {
    const r = e.slice(t);
    return n.test(r) ? r.match(n)[0].length : 0;
  };
}
function Ls() {
  return function(n, e) {
    e.normalize(n);
  };
}
function br(n) {
  const e = n.re = bp(n.__opts__), t = n.__tlds__.slice();
  n.onCompile(), n.__tlds_replaced__ || t.push(Ep), t.push(e.src_xn), e.src_tlds = t.join("|");
  function r(o) {
    return o.replace("%TLDS%", e.src_tlds);
  }
  e.email_fuzzy = RegExp(r(e.tpl_email_fuzzy), "i"), e.email_fuzzy_global = RegExp(r(e.tpl_email_fuzzy), "ig"), e.link_fuzzy = RegExp(r(e.tpl_link_fuzzy), "i"), e.link_fuzzy_global = RegExp(r(e.tpl_link_fuzzy), "ig"), e.link_no_ip_fuzzy = RegExp(r(e.tpl_link_no_ip_fuzzy), "i"), e.link_no_ip_fuzzy_global = RegExp(r(e.tpl_link_no_ip_fuzzy), "ig"), e.host_fuzzy_test = RegExp(r(e.tpl_host_fuzzy_test), "i");
  const i = [];
  n.__compiled__ = {};
  function u(o, l) {
    throw new Error(`(LinkifyIt) Invalid schema "${o}": ${l}`);
  }
  Object.keys(n.__schemas__).forEach(function(o) {
    const l = n.__schemas__[o];
    if (l === null)
      return;
    const a = { validate: null, link: null };
    if (n.__compiled__[o] = a, yp(l)) {
      kp(l.validate) ? a.validate = wp(l.validate) : zs(l.validate) ? a.validate = l.validate : u(o, l), zs(l.normalize) ? a.normalize = l.normalize : l.normalize ? u(o, l) : a.normalize = Ls();
      return;
    }
    if (xp(l)) {
      i.push(o);
      return;
    }
    u(o, l);
  }), i.forEach(function(o) {
    n.__compiled__[n.__schemas__[o]] && (n.__compiled__[o].validate = n.__compiled__[n.__schemas__[o]].validate, n.__compiled__[o].normalize = n.__compiled__[n.__schemas__[o]].normalize);
  }), n.__compiled__[""] = { validate: null, normalize: Ls() };
  const s = Object.keys(n.__compiled__).filter(function(o) {
    return o.length > 0 && n.__compiled__[o];
  }).map(Cp).join("|");
  n.re.schema_test = RegExp(`(^|(?!_)(?:[><｜]|${e.src_ZPCc}))(${s})`, "i"), n.re.schema_search = RegExp(`(^|(?!_)(?:[><｜]|${e.src_ZPCc}))(${s})`, "ig"), n.re.schema_at_start = RegExp(`^${n.re.schema_search.source}`, "i"), n.re.pretest = RegExp(
    `(${n.re.schema_test.source})|(${n.re.host_fuzzy_test.source})|@`,
    "i"
  );
}
function jl(n, e, t, r) {
  const i = n.slice(t, r);
  this.schema = e.toLowerCase(), this.index = t, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
}
function le(n, e) {
  if (!(this instanceof le))
    return new le(n, e);
  e || Dp(n) && (e = n, n = {}), this.__opts__ = wi({}, Wl, e), this.__schemas__ = wi({}, Sp, n), this.__compiled__ = {}, this.__tlds__ = _p, this.__tlds_replaced__ = !1, this.re = {}, br(this);
}
le.prototype.add = function(e, t) {
  return this.__schemas__[e] = t, br(this), this;
};
le.prototype.set = function(e) {
  return this.__opts__ = wi(this.__opts__, e), this;
};
le.prototype.test = function(e) {
  if (!e.length)
    return !1;
  let t, r;
  if (this.re.schema_test.test(e)) {
    for (r = this.re.schema_search, r.lastIndex = 0; (t = r.exec(e)) !== null; )
      if (this.testSchemaAt(e, t[2], r.lastIndex))
        return !0;
  }
  return !!(this.__opts__.fuzzyLink && this.__compiled__["http:"] && e.search(this.re.host_fuzzy_test) >= 0 && e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null || this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && e.indexOf("@") >= 0 && e.match(this.re.email_fuzzy) !== null);
};
le.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
le.prototype.testSchemaAt = function(e, t, r) {
  return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, r, this) : 0;
};
le.prototype.match = function(e) {
  const t = [], r = [], i = [], u = [];
  let s, o, l;
  function a(d, p) {
    return d ? p ? d.index !== p.index ? d.index < p.index ? d : p : d.lastIndex >= p.lastIndex ? d : p : d : p;
  }
  if (!e.length)
    return null;
  if (this.re.schema_test.test(e))
    for (l = this.re.schema_search, l.lastIndex = 0; (s = l.exec(e)) !== null; )
      o = this.testSchemaAt(e, s[2], l.lastIndex), o && r.push({
        schema: s[2],
        index: s.index + s[1].length,
        lastIndex: s.index + s[0].length + o
      });
  if (this.__opts__.fuzzyLink && this.__compiled__["http:"])
    for (l = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global, l.lastIndex = 0; (s = l.exec(e)) !== null; )
      i.push({
        schema: "",
        index: s.index + s[1].length,
        lastIndex: s.index + s[0].length
      });
  if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"])
    for (l = this.re.email_fuzzy_global, l.lastIndex = 0; (s = l.exec(e)) !== null; )
      u.push({
        schema: "mailto:",
        index: s.index + s[1].length,
        lastIndex: s.index + s[0].length
      });
  const c = [0, 0, 0];
  let f = 0;
  for (; ; ) {
    const d = [
      r[c[0]],
      u[c[1]],
      i[c[2]]
    ], p = a(a(d[0], d[1]), d[2]);
    if (!p)
      break;
    if (p === d[0] ? c[0]++ : p === d[1] ? c[1]++ : c[2]++, p.index < f)
      continue;
    const h = new jl(e, p.schema, p.index, p.lastIndex);
    this.__compiled__[h.schema].normalize(h, this), t.push(h), f = p.lastIndex;
  }
  return t.length ? t : null;
};
le.prototype.matchAtStart = function(e) {
  if (!e.length) return null;
  const t = this.re.schema_at_start.exec(e);
  if (!t) return null;
  const r = this.testSchemaAt(e, t[2], t[0].length);
  if (!r) return null;
  const i = new jl(e, t[2], t.index + t[1].length, t.index + t[0].length + r);
  return this.__compiled__[i.schema].normalize(i, this), i;
};
le.prototype.tlds = function(e, t) {
  return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(r, i, u) {
    return r !== u[i - 1];
  }).reverse(), br(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, br(this), this);
};
le.prototype.normalize = function(e) {
  e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
};
le.prototype.onCompile = function() {
};
const At = 2147483647, De = 36, au = 1, xn = 26, Ap = 38, Mp = 700, Jl = 72, Kl = 128, Zl = "-", Tp = /^xn--/, Op = /[^\0-\x7F]/, Np = /[\x2E\u3002\uFF0E\uFF61]/g, Fp = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, ii = De - au, Se = Math.floor, ui = String.fromCharCode;
function ze(n) {
  throw new RangeError(Fp[n]);
}
function vp(n, e) {
  const t = [];
  let r = n.length;
  for (; r--; )
    t[r] = e(n[r]);
  return t;
}
function Gl(n, e) {
  const t = n.split("@");
  let r = "";
  t.length > 1 && (r = t[0] + "@", n = t[1]), n = n.replace(Np, ".");
  const i = n.split("."), u = vp(i, e).join(".");
  return r + u;
}
function Yl(n) {
  const e = [];
  let t = 0;
  const r = n.length;
  for (; t < r; ) {
    const i = n.charCodeAt(t++);
    if (i >= 55296 && i <= 56319 && t < r) {
      const u = n.charCodeAt(t++);
      (u & 64512) == 56320 ? e.push(((i & 1023) << 10) + (u & 1023) + 65536) : (e.push(i), t--);
    } else
      e.push(i);
  }
  return e;
}
const Ip = (n) => String.fromCodePoint(...n), Rp = function(n) {
  return n >= 48 && n < 58 ? 26 + (n - 48) : n >= 65 && n < 91 ? n - 65 : n >= 97 && n < 123 ? n - 97 : De;
}, Vs = function(n, e) {
  return n + 22 + 75 * (n < 26) - ((e != 0) << 5);
}, Xl = function(n, e, t) {
  let r = 0;
  for (n = t ? Se(n / Mp) : n >> 1, n += Se(n / e); n > ii * xn >> 1; r += De)
    n = Se(n / ii);
  return Se(r + (ii + 1) * n / (n + Ap));
}, Ql = function(n) {
  const e = [], t = n.length;
  let r = 0, i = Kl, u = Jl, s = n.lastIndexOf(Zl);
  s < 0 && (s = 0);
  for (let o = 0; o < s; ++o)
    n.charCodeAt(o) >= 128 && ze("not-basic"), e.push(n.charCodeAt(o));
  for (let o = s > 0 ? s + 1 : 0; o < t; ) {
    const l = r;
    for (let c = 1, f = De; ; f += De) {
      o >= t && ze("invalid-input");
      const d = Rp(n.charCodeAt(o++));
      d >= De && ze("invalid-input"), d > Se((At - r) / c) && ze("overflow"), r += d * c;
      const p = f <= u ? au : f >= u + xn ? xn : f - u;
      if (d < p)
        break;
      const h = De - p;
      c > Se(At / h) && ze("overflow"), c *= h;
    }
    const a = e.length + 1;
    u = Xl(r - l, a, l == 0), Se(r / a) > At - i && ze("overflow"), i += Se(r / a), r %= a, e.splice(r++, 0, i);
  }
  return String.fromCodePoint(...e);
}, ea = function(n) {
  const e = [];
  n = Yl(n);
  const t = n.length;
  let r = Kl, i = 0, u = Jl;
  for (const l of n)
    l < 128 && e.push(ui(l));
  const s = e.length;
  let o = s;
  for (s && e.push(Zl); o < t; ) {
    let l = At;
    for (const c of n)
      c >= r && c < l && (l = c);
    const a = o + 1;
    l - r > Se((At - i) / a) && ze("overflow"), i += (l - r) * a, r = l;
    for (const c of n)
      if (c < r && ++i > At && ze("overflow"), c === r) {
        let f = i;
        for (let d = De; ; d += De) {
          const p = d <= u ? au : d >= u + xn ? xn : d - u;
          if (f < p)
            break;
          const h = f - p, m = De - p;
          e.push(
            ui(Vs(p + h % m, 0))
          ), f = Se(h / m);
        }
        e.push(ui(Vs(f, 0))), u = Xl(i, a, o === s), i = 0, ++o;
      }
    ++i, ++r;
  }
  return e.join("");
}, Bp = function(n) {
  return Gl(n, function(e) {
    return Tp.test(e) ? Ql(e.slice(4).toLowerCase()) : e;
  });
}, $p = function(n) {
  return Gl(n, function(e) {
    return Op.test(e) ? "xn--" + ea(e) : e;
  });
}, ta = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  version: "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  ucs2: {
    decode: Yl,
    encode: Ip
  },
  decode: Ql,
  encode: ea,
  toASCII: $p,
  toUnicode: Bp
}, Pp = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 100
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
}, zp = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "text"
      ],
      rules2: [
        "balance_pairs",
        "fragments_join"
      ]
    }
  }
}, Lp = {
  options: {
    // Enable HTML tags in source
    html: !0,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !0,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: [
        "balance_pairs",
        "emphasis",
        "fragments_join"
      ]
    }
  }
}, Vp = {
  default: Pp,
  zero: zp,
  commonmark: Lp
}, qp = /^(vbscript|javascript|file|data):/, Hp = /^data:image\/(gif|png|jpeg|webp);/;
function Up(n) {
  const e = n.trim().toLowerCase();
  return qp.test(e) ? Hp.test(e) : !0;
}
const na = ["http:", "https:", "mailto:"];
function Wp(n) {
  const e = ru(n, !0);
  if (e.hostname && (!e.protocol || na.indexOf(e.protocol) >= 0))
    try {
      e.hostname = ta.toASCII(e.hostname);
    } catch {
    }
  return $n(nu(e));
}
function jp(n) {
  const e = ru(n, !0);
  if (e.hostname && (!e.protocol || na.indexOf(e.protocol) >= 0))
    try {
      e.hostname = ta.toUnicode(e.hostname);
    } catch {
    }
  return Bt(nu(e), Bt.defaultChars + "%");
}
function ae(n, e) {
  if (!(this instanceof ae))
    return new ae(n, e);
  e || uu(n) || (e = n || {}, n = "default"), this.inline = new zn(), this.block = new Tr(), this.core = new ou(), this.renderer = new zt(), this.linkify = new le(), this.validateLink = Up, this.normalizeLink = Wp, this.normalizeLinkText = jp, this.utils = Zh, this.helpers = wr({}, Qh), this.options = {}, this.configure(n), e && this.set(e);
}
ae.prototype.set = function(n) {
  return wr(this.options, n), this;
};
ae.prototype.configure = function(n) {
  const e = this;
  if (uu(n)) {
    const t = n;
    if (n = Vp[t], !n)
      throw new Error('Wrong `markdown-it` preset "' + t + '", check name');
  }
  if (!n)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return n.options && e.set(n.options), n.components && Object.keys(n.components).forEach(function(t) {
    n.components[t].rules && e[t].ruler.enableOnly(n.components[t].rules), n.components[t].rules2 && e[t].ruler2.enableOnly(n.components[t].rules2);
  }), this;
};
ae.prototype.enable = function(n, e) {
  let t = [];
  Array.isArray(n) || (n = [n]), ["core", "block", "inline"].forEach(function(i) {
    t = t.concat(this[i].ruler.enable(n, !0));
  }, this), t = t.concat(this.inline.ruler2.enable(n, !0));
  const r = n.filter(function(i) {
    return t.indexOf(i) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
  return this;
};
ae.prototype.disable = function(n, e) {
  let t = [];
  Array.isArray(n) || (n = [n]), ["core", "block", "inline"].forEach(function(i) {
    t = t.concat(this[i].ruler.disable(n, !0));
  }, this), t = t.concat(this.inline.ruler2.disable(n, !0));
  const r = n.filter(function(i) {
    return t.indexOf(i) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
  return this;
};
ae.prototype.use = function(n) {
  const e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return n.apply(n, e), this;
};
ae.prototype.parse = function(n, e) {
  if (typeof n != "string")
    throw new Error("Input data should be a String");
  const t = new this.core.State(n, this, e);
  return this.core.process(t), t.tokens;
};
ae.prototype.render = function(n, e) {
  return e = e || {}, this.renderer.render(this.parse(n, e), this.options, e);
};
ae.prototype.parseInline = function(n, e) {
  const t = new this.core.State(n, this, e);
  return t.inlineMode = !0, this.core.process(t), t.tokens;
};
ae.prototype.renderInline = function(n, e) {
  return e = e || {}, this.renderer.render(this.parseInline(n, e), this.options, e);
};
const Nr = new ko({
  nodes: {
    doc: {
      content: "block+"
    },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", 0];
      }
    },
    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return ["blockquote", 0];
      }
    },
    horizontal_rule: {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      toDOM() {
        return ["div", ["hr"]];
      }
    },
    heading: {
      attrs: { level: { default: 1 } },
      content: "(text | image)*",
      group: "block",
      defining: !0,
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } }
      ],
      toDOM(n) {
        return ["h" + n.attrs.level, 0];
      }
    },
    code_block: {
      content: "text*",
      group: "block",
      code: !0,
      defining: !0,
      marks: "",
      attrs: { params: { default: "" } },
      parseDOM: [{ tag: "pre", preserveWhitespace: "full", getAttrs: (n) => ({ params: n.getAttribute("data-params") || "" }) }],
      toDOM(n) {
        return ["pre", n.attrs.params ? { "data-params": n.attrs.params } : {}, ["code", 0]];
      }
    },
    ordered_list: {
      content: "list_item+",
      group: "block",
      attrs: { order: { default: 1 }, tight: { default: !1 } },
      parseDOM: [{ tag: "ol", getAttrs(n) {
        return {
          order: n.hasAttribute("start") ? +n.getAttribute("start") : 1,
          tight: n.hasAttribute("data-tight")
        };
      } }],
      toDOM(n) {
        return ["ol", {
          start: n.attrs.order == 1 ? null : n.attrs.order,
          "data-tight": n.attrs.tight ? "true" : null
        }, 0];
      }
    },
    bullet_list: {
      content: "list_item+",
      group: "block",
      attrs: { tight: { default: !1 } },
      parseDOM: [{ tag: "ul", getAttrs: (n) => ({ tight: n.hasAttribute("data-tight") }) }],
      toDOM(n) {
        return ["ul", { "data-tight": n.attrs.tight ? "true" : null }, 0];
      }
    },
    list_item: {
      content: "block+",
      defining: !0,
      parseDOM: [{ tag: "li" }],
      toDOM() {
        return ["li", 0];
      }
    },
    text: {
      group: "inline"
    },
    image: {
      inline: !0,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null }
      },
      group: "inline",
      draggable: !0,
      parseDOM: [{ tag: "img[src]", getAttrs(n) {
        return {
          src: n.getAttribute("src"),
          title: n.getAttribute("title"),
          alt: n.getAttribute("alt")
        };
      } }],
      toDOM(n) {
        return ["img", n.attrs];
      }
    },
    hard_break: {
      inline: !0,
      group: "inline",
      selectable: !1,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      }
    }
  },
  marks: {
    em: {
      parseDOM: [
        { tag: "i" },
        { tag: "em" },
        { style: "font-style=italic" },
        { style: "font-style=normal", clearMark: (n) => n.type.name == "em" }
      ],
      toDOM() {
        return ["em"];
      }
    },
    strong: {
      parseDOM: [
        { tag: "strong" },
        { tag: "b", getAttrs: (n) => n.style.fontWeight != "normal" && null },
        { style: "font-weight=400", clearMark: (n) => n.type.name == "strong" },
        { style: "font-weight", getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null }
      ],
      toDOM() {
        return ["strong"];
      }
    },
    link: {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: !1,
      parseDOM: [{ tag: "a[href]", getAttrs(n) {
        return { href: n.getAttribute("href"), title: n.getAttribute("title") };
      } }],
      toDOM(n) {
        return ["a", n.attrs];
      }
    },
    code: {
      code: !0,
      parseDOM: [{ tag: "code" }],
      toDOM() {
        return ["code"];
      }
    }
  }
});
function Jp(n, e) {
  if (n.isText && e.isText && N.sameSet(n.marks, e.marks))
    return n.withText(n.text + e.text);
}
class Kp {
  constructor(e, t) {
    this.schema = e, this.tokenHandlers = t, this.stack = [{ type: e.topNodeType, attrs: null, content: [], marks: N.none }];
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  push(e) {
    this.stack.length && this.top().content.push(e);
  }
  // Adds the given text to the current position in the document,
  // using the current marks as styling.
  addText(e) {
    if (!e)
      return;
    let t = this.top(), r = t.content, i = r[r.length - 1], u = this.schema.text(e, t.marks), s;
    i && (s = Jp(i, u)) ? r[r.length - 1] = s : r.push(u);
  }
  // Adds the given mark to the set of active marks.
  openMark(e) {
    let t = this.top();
    t.marks = e.addToSet(t.marks);
  }
  // Removes the given mark from the set of active marks.
  closeMark(e) {
    let t = this.top();
    t.marks = e.removeFromSet(t.marks);
  }
  parseTokens(e) {
    for (let t = 0; t < e.length; t++) {
      let r = e[t], i = this.tokenHandlers[r.type];
      if (!i)
        throw new Error("Token type `" + r.type + "` not supported by Markdown parser");
      i(this, r, e, t);
    }
  }
  // Add a node at the current position.
  addNode(e, t, r) {
    let i = this.top(), u = e.createAndFill(t, r, i ? i.marks : []);
    return u ? (this.push(u), u) : null;
  }
  // Wrap subsequent content in a node of the given type.
  openNode(e, t) {
    this.stack.push({ type: e, attrs: t, content: [], marks: N.none });
  }
  // Close and return the node that is currently on top of the stack.
  closeNode() {
    let e = this.stack.pop();
    return this.addNode(e.type, e.attrs, e.content);
  }
}
function qt(n, e, t, r) {
  return n.getAttrs ? n.getAttrs(e, t, r) : n.attrs instanceof Function ? n.attrs(e) : n.attrs;
}
function si(n, e) {
  return n.noCloseToken || e == "code_inline" || e == "code_block" || e == "fence";
}
function qs(n) {
  return n[n.length - 1] == `
` ? n.slice(0, n.length - 1) : n;
}
function oi() {
}
function Zp(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in e) {
    let i = e[r];
    if (i.block) {
      let u = n.nodeType(i.block);
      si(i, r) ? t[r] = (s, o, l, a) => {
        s.openNode(u, qt(i, o, l, a)), s.addText(qs(o.content)), s.closeNode();
      } : (t[r + "_open"] = (s, o, l, a) => s.openNode(u, qt(i, o, l, a)), t[r + "_close"] = (s) => s.closeNode());
    } else if (i.node) {
      let u = n.nodeType(i.node);
      t[r] = (s, o, l, a) => s.addNode(u, qt(i, o, l, a));
    } else if (i.mark) {
      let u = n.marks[i.mark];
      si(i, r) ? t[r] = (s, o, l, a) => {
        s.openMark(u.create(qt(i, o, l, a))), s.addText(qs(o.content)), s.closeMark(u);
      } : (t[r + "_open"] = (s, o, l, a) => s.openMark(u.create(qt(i, o, l, a))), t[r + "_close"] = (s) => s.closeMark(u));
    } else if (i.ignore)
      si(i, r) ? t[r] = oi : (t[r + "_open"] = oi, t[r + "_close"] = oi);
    else
      throw new RangeError("Unrecognized parsing spec " + JSON.stringify(i));
  }
  return t.text = (r, i) => r.addText(i.content), t.inline = (r, i) => r.parseTokens(i.children), t.softbreak = t.softbreak || ((r) => r.addText(" ")), t;
}
class ra {
  /**
  Create a parser with the given configuration. You can configure
  the markdown-it parser to parse the dialect you want, and provide
  a description of the ProseMirror entities those tokens map to in
  the `tokens` object, which maps token names to descriptions of
  what to do with them. Such a description is an object, and may
  have the following properties:
  */
  constructor(e, t, r) {
    this.schema = e, this.tokenizer = t, this.tokens = r, this.tokenHandlers = Zp(e, r);
  }
  /**
  Parse a string as [CommonMark](http://commonmark.org/) markup,
  and create a ProseMirror document as prescribed by this parser's
  rules.
  
  The second argument, when given, is passed through to the
  [Markdown
  parser](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse).
  */
  parse(e, t = {}) {
    let r = new Kp(this.schema, this.tokenHandlers), i;
    r.parseTokens(this.tokenizer.parse(e, t));
    do
      i = r.closeNode();
    while (r.stack.length);
    return i || this.schema.topNodeType.createAndFill();
  }
}
function Hs(n, e) {
  for (; ++e < n.length; )
    if (n[e].type != "list_item_open")
      return n[e].hidden;
  return !1;
}
const Gp = new ra(Nr, ae("commonmark", { html: !1 }), {
  blockquote: { block: "blockquote" },
  paragraph: { block: "paragraph" },
  list_item: { block: "list_item" },
  bullet_list: { block: "bullet_list", getAttrs: (n, e, t) => ({ tight: Hs(e, t) }) },
  ordered_list: { block: "ordered_list", getAttrs: (n, e, t) => ({
    order: +n.attrGet("start") || 1,
    tight: Hs(e, t)
  }) },
  heading: { block: "heading", getAttrs: (n) => ({ level: +n.tag.slice(1) }) },
  code_block: { block: "code_block", noCloseToken: !0 },
  fence: { block: "code_block", getAttrs: (n) => ({ params: n.info || "" }), noCloseToken: !0 },
  hr: { node: "horizontal_rule" },
  image: { node: "image", getAttrs: (n) => ({
    src: n.attrGet("src"),
    title: n.attrGet("title") || null,
    alt: n.children[0] && n.children[0].content || null
  }) },
  hardbreak: { node: "hard_break" },
  em: { mark: "em" },
  strong: { mark: "strong" },
  link: { mark: "link", getAttrs: (n) => ({
    href: n.attrGet("href"),
    title: n.attrGet("title") || null
  }) },
  code_inline: { mark: "code", noCloseToken: !0 }
}), Yp = { open: "", close: "", mixable: !0 };
class ia {
  /**
  Construct a serializer with the given configuration. The `nodes`
  object should map node names in a given schema to function that
  take a serializer state and such a node, and serialize the node.
  */
  constructor(e, t, r = {}) {
    this.nodes = e, this.marks = t, this.options = r;
  }
  /**
  Serialize the content of the given node to
  [CommonMark](http://commonmark.org/).
  */
  serialize(e, t = {}) {
    t = Object.assign({}, this.options, t);
    let r = new Qp(this.nodes, this.marks, t);
    return r.renderContent(e), r.out;
  }
}
const Us = new ia({
  blockquote(n, e) {
    n.wrapBlock("> ", null, e, () => n.renderContent(e));
  },
  code_block(n, e) {
    const t = e.textContent.match(/`{3,}/gm), r = t ? t.sort().slice(-1)[0] + "`" : "```";
    n.write(r + (e.attrs.params || "") + `
`), n.text(e.textContent, !1), n.write(`
`), n.write(r), n.closeBlock(e);
  },
  heading(n, e) {
    n.write(n.repeat("#", e.attrs.level) + " "), n.renderInline(e, !1), n.closeBlock(e);
  },
  horizontal_rule(n, e) {
    n.write(e.attrs.markup || "---"), n.closeBlock(e);
  },
  bullet_list(n, e) {
    n.renderList(e, "  ", () => (e.attrs.bullet || "*") + " ");
  },
  ordered_list(n, e) {
    var t;
    let r = (t = e.attrs.order) !== null && t !== void 0 ? t : 1, i = String(r + e.childCount - 1).length, u = n.repeat(" ", i + 2);
    n.renderList(e, u, (s) => {
      let o = String(r + s);
      return n.repeat(" ", i - o.length) + o + ". ";
    });
  },
  list_item(n, e) {
    n.renderContent(e);
  },
  paragraph(n, e) {
    n.renderInline(e), n.closeBlock(e);
  },
  image(n, e) {
    n.write("![" + n.esc(e.attrs.alt || "") + "](" + e.attrs.src.replace(/[\(\)]/g, "\\$&") + (e.attrs.title ? ' "' + e.attrs.title.replace(/"/g, '\\"') + '"' : "") + ")");
  },
  hard_break(n, e, t, r) {
    for (let i = r + 1; i < t.childCount; i++)
      if (t.child(i).type != e.type) {
        n.write(`\\
`);
        return;
      }
  },
  text(n, e) {
    n.text(e.text, !n.inAutolink);
  }
}, {
  em: { open: "*", close: "*", mixable: !0, expelEnclosingWhitespace: !0 },
  strong: { open: "**", close: "**", mixable: !0, expelEnclosingWhitespace: !0 },
  link: {
    open(n, e, t, r) {
      return n.inAutolink = Xp(e, t, r), n.inAutolink ? "<" : "[";
    },
    close(n, e, t, r) {
      let { inAutolink: i } = n;
      return n.inAutolink = void 0, i ? ">" : "](" + e.attrs.href.replace(/[\(\)"]/g, "\\$&") + (e.attrs.title ? ` "${e.attrs.title.replace(/"/g, '\\"')}"` : "") + ")";
    },
    mixable: !0
  },
  code: {
    open(n, e, t, r) {
      return Ws(t.child(r), -1);
    },
    close(n, e, t, r) {
      return Ws(t.child(r - 1), 1);
    },
    escape: !1
  }
});
function Ws(n, e) {
  let t = /`+/g, r, i = 0;
  if (n.isText)
    for (; r = t.exec(n.text); )
      i = Math.max(i, r[0].length);
  let u = i > 0 && e > 0 ? " `" : "`";
  for (let s = 0; s < i; s++)
    u += "`";
  return i > 0 && e < 0 && (u += " "), u;
}
function Xp(n, e, t) {
  if (n.attrs.title || !/^\w+:/.test(n.attrs.href))
    return !1;
  let r = e.child(t);
  return !r.isText || r.text != n.attrs.href || r.marks[r.marks.length - 1] != n ? !1 : t == e.childCount - 1 || !n.isInSet(e.child(t + 1).marks);
}
class Qp {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.nodes = e, this.marks = t, this.options = r, this.delim = "", this.out = "", this.closed = null, this.inAutolink = void 0, this.atBlockStart = !1, this.inTightList = !1, typeof this.options.tightLists > "u" && (this.options.tightLists = !1), typeof this.options.hardBreakNodeName > "u" && (this.options.hardBreakNodeName = "hard_break");
  }
  /**
  @internal
  */
  flushClose(e = 2) {
    if (this.closed) {
      if (this.atBlank() || (this.out += `
`), e > 1) {
        let t = this.delim, r = /\s+$/.exec(t);
        r && (t = t.slice(0, t.length - r[0].length));
        for (let i = 1; i < e; i++)
          this.out += t + `
`;
      }
      this.closed = null;
    }
  }
  /**
  @internal
  */
  getMark(e) {
    let t = this.marks[e];
    if (!t) {
      if (this.options.strict !== !1)
        throw new Error(`Mark type \`${e}\` not supported by Markdown renderer`);
      t = Yp;
    }
    return t;
  }
  /**
  Render a block, prefixing each line with `delim`, and the first
  line in `firstDelim`. `node` should be the node that is closed at
  the end of the block, and `f` is a function that renders the
  content of the block.
  */
  wrapBlock(e, t, r, i) {
    let u = this.delim;
    this.write(t ?? e), this.delim += e, i(), this.delim = u, this.closeBlock(r);
  }
  /**
  @internal
  */
  atBlank() {
    return /(^|\n)$/.test(this.out);
  }
  /**
  Ensure the current content ends with a newline.
  */
  ensureNewLine() {
    this.atBlank() || (this.out += `
`);
  }
  /**
  Prepare the state for writing output (closing closed paragraphs,
  adding delimiters, and so on), and then optionally add content
  (unescaped) to the output.
  */
  write(e) {
    this.flushClose(), this.delim && this.atBlank() && (this.out += this.delim), e && (this.out += e);
  }
  /**
  Close the block for the given node.
  */
  closeBlock(e) {
    this.closed = e;
  }
  /**
  Add the given text to the document. When escape is not `false`,
  it will be escaped.
  */
  text(e, t = !0) {
    let r = e.split(`
`);
    for (let i = 0; i < r.length; i++)
      this.write(), !t && r[i][0] == "[" && /(^|[^\\])\!$/.test(this.out) && (this.out = this.out.slice(0, this.out.length - 1) + "\\!"), this.out += t ? this.esc(r[i], this.atBlockStart) : r[i], i != r.length - 1 && (this.out += `
`);
  }
  /**
  Render the given node as a block.
  */
  render(e, t, r) {
    if (this.nodes[e.type.name])
      this.nodes[e.type.name](this, e, t, r);
    else {
      if (this.options.strict !== !1)
        throw new Error("Token type `" + e.type.name + "` not supported by Markdown renderer");
      e.type.isLeaf || (e.type.inlineContent ? this.renderInline(e) : this.renderContent(e), e.isBlock && this.closeBlock(e));
    }
  }
  /**
  Render the contents of `parent` as block nodes.
  */
  renderContent(e) {
    e.forEach((t, r, i) => this.render(t, e, i));
  }
  /**
  Render the contents of `parent` as inline content.
  */
  renderInline(e, t = !0) {
    this.atBlockStart = t;
    let r = [], i = "", u = (s, o, l) => {
      let a = s ? s.marks : [];
      s && s.type.name === this.options.hardBreakNodeName && (a = a.filter((m) => {
        if (l + 1 == e.childCount)
          return !1;
        let g = e.child(l + 1);
        return m.isInSet(g.marks) && (!g.isText || /\S/.test(g.text));
      }));
      let c = i;
      if (i = "", s && s.isText && a.some((m) => {
        let g = this.getMark(m.type.name);
        return g && g.expelEnclosingWhitespace && !m.isInSet(r);
      })) {
        let [m, g, b] = /^(\s*)(.*)$/m.exec(s.text);
        g && (c += g, s = b ? s.withText(b) : null, s || (a = r));
      }
      if (s && s.isText && a.some((m) => {
        let g = this.getMark(m.type.name);
        return g && g.expelEnclosingWhitespace && !this.isMarkAhead(e, l + 1, m);
      })) {
        let [m, g, b] = /^(.*?)(\s*)$/m.exec(s.text);
        b && (i = b, s = g ? s.withText(g) : null, s || (a = r));
      }
      let f = a.length ? a[a.length - 1] : null, d = f && this.getMark(f.type.name).escape === !1, p = a.length - (d ? 1 : 0);
      e: for (let m = 0; m < p; m++) {
        let g = a[m];
        if (!this.getMark(g.type.name).mixable)
          break;
        for (let b = 0; b < r.length; b++) {
          let C = r[b];
          if (!this.getMark(C.type.name).mixable)
            break;
          if (g.eq(C)) {
            m > b ? a = a.slice(0, b).concat(g).concat(a.slice(b, m)).concat(a.slice(m + 1, p)) : b > m && (a = a.slice(0, m).concat(a.slice(m + 1, b)).concat(g).concat(a.slice(b, p)));
            continue e;
          }
        }
      }
      let h = 0;
      for (; h < Math.min(r.length, p) && a[h].eq(r[h]); )
        ++h;
      for (; h < r.length; )
        this.text(this.markString(r.pop(), !1, e, l), !1);
      if (c && this.text(c), s) {
        for (; r.length < p; ) {
          let m = a[r.length];
          r.push(m), this.text(this.markString(m, !0, e, l), !1), this.atBlockStart = !1;
        }
        d && s.isText ? this.text(this.markString(f, !0, e, l) + s.text + this.markString(f, !1, e, l + 1), !1) : this.render(s, e, l), this.atBlockStart = !1;
      }
      s?.isText && s.nodeSize > 0 && (this.atBlockStart = !1);
    };
    e.forEach(u), u(null, 0, e.childCount), this.atBlockStart = !1;
  }
  /**
  Render a node's content as a list. `delim` should be the extra
  indentation added to all lines except the first in an item,
  `firstDelim` is a function going from an item index to a
  delimiter for the first line of the item.
  */
  renderList(e, t, r) {
    this.closed && this.closed.type == e.type ? this.flushClose(3) : this.inTightList && this.flushClose(1);
    let i = typeof e.attrs.tight < "u" ? e.attrs.tight : this.options.tightLists, u = this.inTightList;
    this.inTightList = i, e.forEach((s, o, l) => {
      l && i && this.flushClose(1), this.wrapBlock(t, r(l), e, () => this.render(s, e, l));
    }), this.inTightList = u;
  }
  /**
  Escape the given string so that it can safely appear in Markdown
  content. If `startOfLine` is true, also escape characters that
  have special meaning only at the start of the line.
  */
  esc(e, t = !1) {
    return e = e.replace(/[`*\\~\[\]_]/g, (r, i) => r == "_" && i > 0 && i + 1 < e.length && e[i - 1].match(/\w/) && e[i + 1].match(/\w/) ? r : "\\" + r), t && (e = e.replace(/^(\+[ ]|[\-*>])/, "\\$&").replace(/^(\s*)(#{1,6})(\s|$)/, "$1\\$2$3").replace(/^(\s*\d+)\.\s/, "$1\\. ")), this.options.escapeExtraCharacters && (e = e.replace(this.options.escapeExtraCharacters, "\\$&")), e;
  }
  /**
  @internal
  */
  quote(e) {
    let t = e.indexOf('"') == -1 ? '""' : e.indexOf("'") == -1 ? "''" : "()";
    return t[0] + e + t[1];
  }
  /**
  Repeat the given string `n` times.
  */
  repeat(e, t) {
    let r = "";
    for (let i = 0; i < t; i++)
      r += e;
    return r;
  }
  /**
  Get the markdown string for a given opening or closing mark.
  */
  markString(e, t, r, i) {
    let u = this.getMark(e.type.name), s = t ? u.open : u.close;
    return typeof s == "string" ? s : s(this, e, r, i);
  }
  /**
  Get leading and trailing whitespace from a string. Values of
  leading or trailing property of the return object will be undefined
  if there is no match.
  */
  getEnclosingWhitespace(e) {
    return {
      leading: (e.match(/^(\s+)/) || [void 0])[0],
      trailing: (e.match(/(\s+)$/) || [void 0])[0]
    };
  }
  /**
  @internal
  */
  isMarkAhead(e, t, r) {
    for (; ; t++) {
      if (t >= e.childCount)
        return !1;
      let i = e.child(t);
      if (i.type.name != this.options.hardBreakNodeName)
        return r.isInSet(i.marks);
      t++;
    }
  }
}
const ua = Nr.spec.nodes.get("list_item");
if (!ua) throw new Error("CommonMark list_item schema is unavailable.");
const e1 = Nr.spec.nodes.update("list_item", {
  ...ua,
  attrs: {
    checked: { default: null }
  },
  parseDOM: [
    {
      tag: "li",
      getAttrs: (n) => {
        const e = n;
        return e.hasAttribute("data-task") ? { checked: e.getAttribute("data-checked") === "true" } : { checked: null };
      }
    }
  ],
  toDOM(n) {
    const e = n.attrs.checked;
    return [
      "li",
      e === null ? {} : {
        "data-task": "true",
        "data-checked": e ? "true" : "false"
      },
      0
    ];
  }
}).append({
  soft_break: {
    inline: !0,
    group: "inline",
    selectable: !1,
    parseDOM: [{ tag: "br[data-soft-break]" }],
    toDOM() {
      return ["br", { "data-soft-break": "true" }];
    }
  },
  table: {
    content: "table_row+",
    group: "block",
    isolating: !0,
    parseDOM: [{ tag: "table" }],
    toDOM() {
      return ["table", ["tbody", 0]];
    }
  },
  table_row: {
    content: "(table_header | table_cell)+",
    parseDOM: [{ tag: "tr" }],
    toDOM() {
      return ["tr", 0];
    }
  },
  table_header: {
    attrs: { align: { default: null } },
    content: "inline*",
    defining: !0,
    parseDOM: [{ tag: "th" }],
    toDOM(n) {
      return ["th", n.attrs.align ? { style: `text-align: ${n.attrs.align}` } : {}, 0];
    }
  },
  table_cell: {
    attrs: { align: { default: null } },
    content: "inline*",
    defining: !0,
    parseDOM: [{ tag: "td" }],
    toDOM(n) {
      return ["td", n.attrs.align ? { style: `text-align: ${n.attrs.align}` } : {}, 0];
    }
  }
}), t1 = Nr.spec.marks.append({
  strike: {
    parseDOM: [
      { tag: "s" },
      { tag: "del" },
      { style: "text-decoration=line-through" }
    ],
    toDOM() {
      return ["s", 0];
    }
  }
}), $ = new ko({ nodes: e1, marks: t1 });
function js(n) {
  return { align: /text-align:\s*(left|center|right)/i.exec(n ?? "")?.[1]?.toLowerCase() ?? null };
}
const sa = new ae("default", {
  html: !1,
  linkify: !0
});
sa.core.ruler.after("inline", "sidenote-task-list", (n) => {
  for (let e = 0; e < n.tokens.length; e += 1) {
    const t = n.tokens[e];
    if (t.type === "list_item_open")
      for (let r = e + 1; r < n.tokens.length; r += 1) {
        const i = n.tokens[r];
        if (i.type === "list_item_close") break;
        if (i.type !== "inline") continue;
        const u = /^\[([ xX])\]\s+/.exec(i.content);
        if (!u) break;
        t.meta = {
          ...t.meta,
          task: !0,
          checked: u[1].toLowerCase() === "x"
        }, i.content = i.content.slice(u[0].length);
        const s = i.children?.find((o) => o.type === "text");
        s && (s.content = s.content.slice(u[0].length));
        break;
      }
  }
});
const n1 = {
  ...Gp.tokens,
  list_item: {
    block: "list_item",
    getAttrs: (n) => ({
      checked: n.meta?.task ? !!n.meta.checked : null
    })
  },
  softbreak: { node: "soft_break" },
  s: { mark: "strike" },
  table: { block: "table" },
  thead: { ignore: !0 },
  tbody: { ignore: !0 },
  tr: { block: "table_row" },
  th: {
    block: "table_header",
    getAttrs: (n) => js(n.attrGet("style"))
  },
  td: {
    block: "table_cell",
    getAttrs: (n) => js(n.attrGet("style"))
  }
}, r1 = new ra($, sa, n1);
let cu;
function i1(n) {
  const e = $.nodes.paragraph.create(null, n.content), t = $.topNodeType.create(null, [e]);
  return cu.serialize(t).trim().replace(new RegExp("(?<!\\\\)\\|", "g"), "\\|").replace(/\n/g, "<br>");
}
function u1(n) {
  return n === "left" ? ":---" : n === "center" ? ":---:" : n === "right" ? "---:" : "---";
}
function s1(n, e) {
  const t = [], r = [];
  if (e.forEach((l, a, c) => {
    const f = [];
    l.forEach((d, p, h) => {
      f.push(i1(d)), c === 0 && (r[h] = d.attrs.align ?? null);
    }), t.push(f);
  }), !t.length) return;
  const i = Math.max(...t.map((l) => l.length)), u = (l) => [
    ...l,
    ...Array.from({ length: i - l.length }, () => "")
  ], s = (l) => `| ${u(l).join(" | ")} |`, o = [
    s(t[0]),
    s(
      Array.from(
        { length: i },
        (l, a) => u1(r[a] ?? null)
      )
    ),
    ...t.slice(1).map(s)
  ];
  n.write(o.join(`
`)), n.closeBlock(e);
}
cu = new ia(
  {
    ...Us.nodes,
    list_item(n, e) {
      e.attrs.checked !== null && n.write(`[${e.attrs.checked ? "x" : " "}] `), n.renderContent(e);
    },
    soft_break(n) {
      n.write(`
`);
    },
    table: s1,
    table_row() {
    },
    table_header() {
    },
    table_cell() {
    }
  },
  {
    ...Us.marks,
    strike: {
      open: "~~",
      close: "~~",
      mixable: !0,
      expelEnclosingWhitespace: !0
    }
  }
);
function Js(n) {
  return r1.parse(n ?? "");
}
function Kn(n) {
  return cu.serialize(n);
}
function me(n) {
  return ({ state: e, dispatch: t, view: r }) => n(e, t, r);
}
const o1 = {
  undo: me(ar),
  redo: me(Yt),
  paragraph: me(Un($.nodes.paragraph)),
  heading1: me(
    Un($.nodes.heading, { level: 1 })
  ),
  heading2: me(
    Un($.nodes.heading, { level: 2 })
  ),
  heading3: me(
    Un($.nodes.heading, { level: 3 })
  ),
  toggleBold: me(Wn($.marks.strong)),
  toggleItalic: me(Wn($.marks.em)),
  toggleCode: me(Wn($.marks.code)),
  toggleStrike: me(Wn($.marks.strike)),
  blockquote: me(uf($.nodes.blockquote))
};
class xe {
  /**
  Create an input rule. The rule applies when the user typed
  something and the text directly in front of the cursor matches
  `match`, which should end with `$`.
  
  The `handler` can be a string, in which case the matched text, or
  the first matched group in the regexp, is replaced by that
  string.
  
  Or a it can be a function, which will be called with the match
  array produced by
  [`RegExp.exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec),
  as well as the start and end of the matched range, and which can
  return a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) that describes the
  rule's effect, or null to indicate the input was not handled.
  */
  constructor(e, t, r = {}) {
    this.match = e, this.match = e, this.handler = typeof t == "string" ? l1(t) : t, this.undoable = r.undoable !== !1, this.inCode = r.inCode || !1, this.inCodeMark = r.inCodeMark !== !1;
  }
}
function l1(n) {
  return function(e, t, r, i) {
    let u = n;
    if (t[1]) {
      let s = t[0].lastIndexOf(t[1]);
      u += t[0].slice(s + t[1].length), r += s;
      let o = r - i;
      o > 0 && (u = t[0].slice(s - o, s) + u, r = i);
    }
    return e.tr.insertText(u, r, i);
  };
}
const a1 = 500;
function oa({ rules: n }) {
  let e = new Dr({
    state: {
      init() {
        return null;
      },
      apply(t, r) {
        let i = t.getMeta(this);
        return i || (t.selectionSet || t.docChanged ? null : r);
      }
    },
    props: {
      handleTextInput(t, r, i, u) {
        return Ks(t, r, i, u, n, e);
      },
      handleDOMEvents: {
        compositionend: (t) => {
          setTimeout(() => {
            let { $cursor: r } = t.state.selection;
            r && Ks(t, r.pos, r.pos, "", n, e);
          });
        }
      }
    },
    isInputRules: !0
  });
  return e;
}
function Ks(n, e, t, r, i, u) {
  if (n.composing)
    return !1;
  let s = n.state, o = s.doc.resolve(e), l = o.parent.textBetween(Math.max(0, o.parentOffset - a1), o.parentOffset, null, "￼") + r;
  for (let a = 0; a < i.length; a++) {
    let c = i[a];
    if (!c.inCodeMark && o.marks().some((h) => h.type.spec.code))
      continue;
    if (o.parent.type.spec.code) {
      if (!c.inCode)
        continue;
    } else if (c.inCode === "only")
      continue;
    let f = c.match.exec(l);
    if (!f || f[0].length < r.length)
      continue;
    let d = e - (f[0].length - r.length);
    if (!c.inCodeMark) {
      let h = !1;
      if (s.doc.nodesBetween(d, o.pos, (m) => {
        m.isInline && m.marks.some((g) => g.type.spec.code) && (h = !0);
      }), h)
        continue;
    }
    let p = c.handler(s, f, d, t);
    if (p)
      return c.undoable && p.setMeta(u, { transform: p, from: e, to: t, text: r }), n.dispatch(p), !0;
  }
  return !1;
}
new xe(/--$/, "—", { inCodeMark: !1 });
new xe(/\.\.\.$/, "…", { inCodeMark: !1 });
new xe(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“", { inCodeMark: !1 });
new xe(/"$/, "”", { inCodeMark: !1 });
new xe(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘", { inCodeMark: !1 });
new xe(/'$/, "’", { inCodeMark: !1 });
function li(n, e, t = null, r) {
  return new xe(n, (i, u, s, o) => {
    let l = t instanceof Function ? t(u) : t, a = i.tr.delete(s, o), c = a.doc.resolve(s), f = c.blockRange(), d = f && Mo(f, e, l);
    if (!d)
      return null;
    a.wrap(f, d);
    let p = a.doc.resolve(s - 1).nodeBefore;
    return p && p.type == e && Hi(a.doc, s - 1) && (!r || r(u, p)) && a.join(s - 1), a;
  });
}
function Zs(n, e, t = null) {
  return new xe(n, (r, i, u, s) => {
    let o = r.doc.resolve(u), l = t instanceof Function ? t(i) : t;
    return o.node(-1).canReplaceWith(o.index(-1), o.indexAfter(-1), e) ? r.tr.delete(u, s).setBlockType(u, u, e, l) : null;
  });
}
class c1 {
  #e = /* @__PURE__ */ new Map();
  add(e) {
    if (!e.name.trim())
      throw new Error("Extension name must not be empty.");
    if (this.#e.has(e.name))
      throw new Error(`Extension "${e.name}" is already registered.`);
    this.#e.set(e.name, e);
  }
  remove(e) {
    return this.#e.delete(e);
  }
  has(e) {
    return this.#e.has(e);
  }
  list() {
    return [...this.#e.values()].sort(
      (e, t) => (t.priority ?? 0) - (e.priority ?? 0)
    );
  }
  commands(e) {
    const t = { ...e };
    for (const r of [...this.list()].reverse())
      Object.assign(t, r.commands);
    return t;
  }
  plugins() {
    const e = [];
    for (const t of this.list())
      t.shortcuts && e.push(
        er(
          Object.fromEntries(
            Object.entries(t.shortcuts).map(([r, i]) => [
              r,
              (u, s, o) => i({ state: u, dispatch: s, view: o })
            ])
          )
        )
      ), t.inputRules?.length && e.push(
        oa({
          rules: t.inputRules.map(
            (r) => new xe(
              r.match,
              (i, u, s, o) => r.run({
                state: i,
                match: u,
                range: { from: s, to: o }
              })
            )
          )
        })
      );
    return e;
  }
}
function f1() {
  const n = [
    Zs(
      /^(#{1,6})\s$/,
      $.nodes.heading,
      (e) => ({ level: e[1].length })
    ),
    Zs(/^```$/, $.nodes.code_block),
    li(/^\s*>\s$/, $.nodes.blockquote),
    li(/^\s*([-+*])\s$/, $.nodes.bullet_list),
    li(
      /^(\d+)\.\s$/,
      $.nodes.ordered_list,
      (e) => ({ order: Number(e[1]) }),
      (e, t) => t.childCount + t.attrs.order === Number(e[1])
    ),
    new xe(/^\[([ xX])\]\s$/, (e, t, r, i) => {
      const u = e.doc.resolve(r);
      for (let s = u.depth; s > 0; s -= 1) {
        const o = u.node(s);
        if (o.type === $.nodes.list_item)
          return e.tr.delete(r, i).setNodeMarkup(u.before(s), void 0, {
            ...o.attrs,
            checked: t[1].toLowerCase() === "x"
          });
      }
      return null;
    }),
    new xe(/^---$/, (e, t, r, i) => {
      const u = $.nodes.horizontal_rule;
      return u ? e.tr.replaceWith(r, i, u.create()) : null;
    })
  ];
  return oa({ rules: n });
}
const h1 = Da`
  :host {
    --editor-background: transparent;
    --editor-color: inherit;
    --editor-border: 0;
    --editor-border-radius: 0;
    --editor-border-color: currentColor;
    --editor-muted-background: transparent;
    --editor-accent: currentColor;
    --editor-font-family: inherit;
    --editor-code-font-family: inherit;
    --editor-font-size: inherit;
    --editor-min-height: 240px;
    --editor-padding: 0;
    --editor-line-height: inherit;
    --editor-heading-line-height: inherit;
    --editor-code-padding: 0;
    --editor-code-border-radius: 0;
    --editor-code-white-space: pre-wrap;
    --editor-code-word-break: break-word;
    --editor-code-overflow-x: hidden;

    display: block;
    min-width: 0;
    color: var(--editor-color);
    font-family: var(--editor-font-family);
    font-size: var(--editor-font-size);
  }

  * {
    box-sizing: border-box;
  }

  .surface {
    position: relative;
    min-height: var(--editor-min-height);
    overflow: auto;
    border: var(--editor-border);
    border-radius: var(--editor-border-radius);
    background: var(--editor-background);
  }

  .editor-mount,
  .source-editor {
    min-height: var(--editor-min-height);
  }

  .editor-mount[hidden],
  .source-editor[hidden] {
    display: none;
  }

  .editor-mount .ProseMirror {
    min-height: var(--editor-min-height);
    padding: var(--editor-padding);
    outline: none;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .editor-mount .ProseMirror > *:first-child {
    margin-top: 0;
  }

  .editor-mount .ProseMirror > *:last-child {
    margin-bottom: 0;
  }

  .editor-mount .ProseMirror p {
    line-height: var(--editor-line-height);
  }

  .editor-mount .ProseMirror h1,
  .editor-mount .ProseMirror h2,
  .editor-mount .ProseMirror h3,
  .editor-mount .ProseMirror h4,
  .editor-mount .ProseMirror h5,
  .editor-mount .ProseMirror h6 {
    line-height: var(--editor-heading-line-height);
  }

  .editor-mount .ProseMirror blockquote {
    margin-left: 0;
    padding-left: 0;
  }

  .editor-mount .ProseMirror pre,
  .editor-mount .ProseMirror code {
    font-family: var(--editor-code-font-family);
    background: var(--editor-muted-background);
  }

  .editor-mount .ProseMirror pre {
    overflow-x: var(--editor-code-overflow-x);
    padding: var(--editor-code-padding);
    border-radius: var(--editor-code-border-radius);
    white-space: var(--editor-code-white-space);
    overflow-wrap: anywhere;
    word-break: var(--editor-code-word-break);
  }

  .editor-mount .ProseMirror code {
    border-radius: var(--editor-code-border-radius);
  }

  .editor-mount .ProseMirror pre code {
    padding: 0;
  }

  .editor-mount .ProseMirror .code-block-container pre {
    margin-top: 0;
  }

  .code-block-content[data-line-numbers] {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
  }

  .code-block-content pre {
    min-width: 0;
  }

  .code-line-numbers {
    font-family: var(--editor-code-font-family);
    line-height: var(--editor-line-height);
    vertical-align: top;
    white-space: pre;
    word-break: keep-all;
    user-select: none;
  }

  .code-line-numbers[hidden] {
    display: none;
  }

  .code-line-numbers span {
    display: block;
  }

  .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .code-block-header[hidden] {
    display: none;
  }

  .code-block-language {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .editor-mount .ProseMirror img {
    max-width: 100%;
    height: auto;
  }

  .editor-mount .ProseMirror li[data-task] {
    display: flex;
    align-items: flex-start;
    gap: 0.55em;
    list-style: none;
  }

  .editor-mount .ProseMirror li[data-task] > input {
    flex: 0 0 auto;
    width: 1em;
    height: 1em;
    margin: 0.38em 0 0;
    accent-color: var(--editor-accent);
  }

  .editor-mount .ProseMirror .task-content {
    flex: 1 1 auto;
    min-width: 0;
  }

  .editor-mount .ProseMirror .task-content > *:first-child {
    margin-top: 0;
  }

  .editor-mount .ProseMirror .task-content > *:last-child {
    margin-bottom: 0;
  }

  .editor-mount .ProseMirror li[data-checked="true"] .task-content {
    opacity: 0.7;
    text-decoration: line-through;
  }

  .editor-mount .ProseMirror table {
    width: 100%;
    margin: 1em 0;
    border-collapse: collapse;
  }

  .editor-mount .ProseMirror th,
  .editor-mount .ProseMirror td {
    min-width: 4em;
    padding: 0;
    text-align: left;
    vertical-align: top;
  }

  .editor-mount .ProseMirror th {
    background: var(--editor-muted-background);
    font-weight: 650;
  }

  .source-editor {
    display: block;
    width: 100%;
    resize: none;
    border: 0;
    padding: var(--editor-padding);
    outline: none;
    background: var(--editor-background);
    color: var(--editor-color);
    font: inherit;
    font-family: var(--editor-code-font-family);
    line-height: var(--editor-line-height);
    tab-size: 2;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .block-source-panel {
    position: sticky;
    bottom: 0;
    z-index: 2;
    border-top: 1px solid var(--editor-border-color);
    padding: 12px;
    background: var(--editor-muted-background);
    box-shadow: 0 -8px 24px rgb(0 0 0 / 8%);
  }

  .block-source-panel textarea {
    display: block;
    width: 100%;
    min-height: 120px;
    resize: vertical;
    border: 1px solid var(--editor-border-color);
    border-radius: 6px;
    padding: 10px;
    background: var(--editor-background);
    color: var(--editor-color);
    font-family: var(--editor-code-font-family);
    font-size: 0.9em;
    line-height: 1.5;
  }

  .block-source-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }

  button {
    border: 1px solid var(--editor-border-color);
    border-radius: 6px;
    padding: 6px 10px;
    background: var(--editor-background);
    color: var(--editor-color);
    cursor: pointer;
  }

  button.primary {
    border-color: var(--editor-accent);
    background: var(--editor-accent);
    color: #ffffff;
  }

  :host([disabled]) {
    opacity: 0.65;
  }

  :host([disabled]) .surface {
    cursor: not-allowed;
  }

  .placeholder {
    pointer-events: none;
    position: absolute;
    margin: 16px;
    color: color-mix(in srgb, var(--editor-color) 45%, transparent);
  }
`;
var S, Ne, qe, ot, He, yn, kn, Cn, Dn, Sn, En, lt, Mt, Tt, y, Mi, ee, Ti, Oi, la, aa, Ni, Et, tr, Fi, vi, jt, ca, fa, ha, da, pa, ma, ga, nr, ba, rr, _n, wn, An, Mn, Ii, Tn, On;
const en = class en extends Kt {
  constructor() {
    super();
    z(this, y);
    z(this, S);
    z(this, Ne);
    z(this, qe);
    z(this, ot);
    z(this, He);
    z(this, yn);
    z(this, kn);
    z(this, Cn);
    z(this, Dn);
    z(this, Sn);
    z(this, En);
    z(this, lt);
    z(this, Mt);
    z(this, Tt);
    z(this, _n);
    z(this, wn);
    z(this, An);
    z(this, Mn);
    z(this, Tn);
    z(this, On);
    this.value = "", this.mode = "wysiwyg", this.placeholder = "", this.readonly = !1, this.disabled = !1, this.name = "", this.sourceEditScope = "document", this.showCodeBlockHeader = !0, this.showCodeLineNumbers = !1, this.themeCss = "", this.blockSourceOpen = !1, this.blockSourceValue = "", this.documentSourceValue = "", v(this, Ne, new c1()), v(this, ot, ""), v(this, He, []), v(this, yn, bf()), v(this, kn, f1()), v(this, Cn, new Dr({
      props: {
        decorations: (t) => _(this, y, ga).call(this, t.doc)
      }
    })), v(this, Dn, er({
      "Mod-z": ar,
      "Shift-Mod-z": Yt,
      "Mod-y": Yt
    })), v(this, Sn, er({
      "Shift-Enter": Sr(Vo, (t, r) => {
        const i = t.schema.nodes.soft_break, { $from: u, $to: s } = t.selection;
        return !i || !u.sameParent(s) || !u.parent.inlineContent ? !1 : (r && r(t.tr.replaceSelectionWith(i.create()).scrollIntoView()), !0);
      })
    })), v(this, En, er(lf)), v(this, Mt, ""), v(this, Tt, "wysiwyg"), this.cancelBlockSourceEdit = () => {
      this.blockSourceOpen = !1, this.blockSourceValue = "", v(this, qe, void 0), x(this, S)?.setProps({ editable: () => _(this, y, ee).call(this) }), _(this, y, rr).call(this), x(this, S)?.focus();
    }, this.applyBlockSourceEdit = () => {
      if (!x(this, S) || !x(this, qe)) return;
      const t = _(this, y, Et).call(this, this.blockSourceValue), { from: r, to: i } = x(this, qe);
      x(this, S).dispatch(
        x(this, S).state.tr.replaceWith(r, i, t.content).scrollIntoView().setMeta("wysiwygMarkdownSource", "source-edit")
      ), this.blockSourceOpen = !1, this.blockSourceValue = "", v(this, qe, void 0), x(this, S).setProps({ editable: () => _(this, y, ee).call(this) }), _(this, y, rr).call(this), _(this, y, Fi).call(this, "source-edit"), x(this, S).focus();
    }, v(this, _n, (t) => {
      if (!x(this, S) || this.disabled || this.readonly) return;
      if (this.sourceEditScope !== "block") {
        t.preventDefault(), this.setMode("source"), this.updateComplete.then(() => this.focus());
        return;
      }
      if (!_(this, y, ee).call(this)) return;
      const r = x(this, S).posAtCoords({
        left: t.clientX,
        top: t.clientY
      });
      if (!r) return;
      const i = x(this, S).state.doc.resolve(r.pos);
      if (i.depth < 1) return;
      const u = i.node(1), s = i.before(1), o = i.after(1), l = $.topNodeType.create(null, [u]);
      v(this, qe, { from: s, to: o }), this.blockSourceValue = Kn(l), this.blockSourceOpen = !0, x(this, S).setProps({ editable: () => _(this, y, ee).call(this) }), this.updateComplete.then(() => {
        const a = this.renderRoot.querySelector("#block-source");
        a?.focus(), a?.select();
      });
    }), v(this, wn, (t) => {
      this.documentSourceValue = t.currentTarget.value, this.value = this.documentSourceValue, _(this, y, tr).call(this, "source-edit");
    }), v(this, An, (t) => {
      (t.ctrlKey || t.metaKey) && t.key === "Enter" && (t.preventDefault(), this.setMode(x(this, Tt)));
    }), v(this, Mn, (t) => {
      if (this.disabled || this.readonly) return;
      const r = t.currentTarget, i = [...t.clipboardData?.files ?? []].find(
        (o) => o.type.startsWith("image/")
      );
      if (i && this.uploadImage) {
        t.preventDefault();
        const o = r.selectionStart, l = r.selectionEnd;
        this.uploadImage(i).then((a) => {
          if (!a) return;
          const c = (i.name || "Image").replaceAll("]", "\\]");
          _(this, y, Ii).call(this, r, `![${c}](${a})`, o, l);
        }).catch((a) => _(this, y, jt).call(this, a, `[image paste: ${i.name}]`));
        return;
      }
      if (!this.transformPastedText) return;
      const u = t.clipboardData?.getData("text/plain");
      if (u === void 0) return;
      const s = this.transformPastedText(u);
      s !== u && (t.preventDefault(), _(this, y, Ii).call(this, r, s));
    }), v(this, Tn, (t) => {
      this.blockSourceValue = t.currentTarget.value;
    }), v(this, On, (t) => {
      if (t.key === "Escape") {
        t.preventDefault(), this.cancelBlockSourceEdit();
        return;
      }
      (t.ctrlKey || t.metaKey) && t.key === "Enter" && (t.preventDefault(), this.applyBlockSourceEdit());
    }), typeof this.attachInternals == "function" && v(this, lt, this.attachInternals());
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "textbox"), this.hasAttribute("aria-multiline") || this.setAttribute("aria-multiline", "true"), this.hasUpdated && !x(this, S) && this.updateComplete.then(() => _(this, y, Mi).call(this));
  }
  render() {
    const t = this.mode === "source", r = !this.value.trim();
    return Rr`
      <div class="surface" part="surface">
        ${r && !t && this.placeholder ? Rr`<div class="placeholder" part="placeholder">${this.placeholder}</div>` : V}
        <div
          id="editor-mount"
          class="editor-mount"
          part="editor"
          ?hidden=${t}
          @dblclick=${x(this, _n)}
        ></div>
        <textarea
          id="document-source"
          class="source-editor"
          part="source-editor"
          aria-label="Markdown source"
          spellcheck="false"
          ?hidden=${!t}
          ?readonly=${this.readonly}
          ?disabled=${this.disabled}
          .value=${this.documentSourceValue}
          @input=${x(this, wn)}
          @keydown=${x(this, An)}
          @paste=${x(this, Mn)}
        ></textarea>
        ${this.blockSourceOpen ? Rr`
              <section class="block-source-panel" part="block-source-panel">
                <textarea
                  id="block-source"
                  aria-label="Block Markdown source"
                  spellcheck="false"
                  .value=${this.blockSourceValue}
                  @input=${x(this, Tn)}
                  @keydown=${x(this, On)}
                ></textarea>
                <div class="block-source-actions">
                  <button type="button" @click=${this.cancelBlockSourceEdit}>취소</button>
                  <button
                    type="button"
                    class="primary"
                    @click=${this.applyBlockSourceEdit}
                  >적용</button>
                </div>
              </section>
            ` : V}
        <style id="host-theme"></style>
      </div>
    `;
  }
  firstUpdated() {
    _(this, y, Mi).call(this);
  }
  willUpdate(t) {
    !this.hasUpdated && t.has("value") && (this.value = Kn(_(this, y, Et).call(this, this.value))), t.has("mode") && this.mode === "source" && (this.documentSourceValue = this.value);
  }
  updated(t) {
    if (x(this, S) && (t.has("value") && this.mode !== "source" && this.value !== x(this, ot) && _(this, y, Ni).call(this, this.value, !1), t.has("mode") && (t.get("mode") === "source" && this.mode !== "source" && _(this, y, Ni).call(this, this.documentSourceValue, !0, "source-edit"), x(this, S).setProps({ editable: () => _(this, y, ee).call(this) }), this.dispatchEvent(
      new CustomEvent("mode-change", {
        detail: { mode: this.mode },
        bubbles: !0,
        composed: !0
      })
    )), (t.has("readonly") || t.has("disabled")) && x(this, S).setProps({ editable: () => _(this, y, ee).call(this) }), (t.has("mode") || t.has("readonly") || t.has("disabled")) && _(this, y, rr).call(this), (t.has("showCodeBlockHeader") || t.has("showCodeLineNumbers")) && _(this, y, ma).call(this), t.has("codeHighlighter") && x(this, S).dispatch(x(this, S).state.tr), (t.has("value") || t.has("disabled")) && _(this, y, vi).call(this), t.has("themeCss"))) {
      const r = this.renderRoot.querySelector("#host-theme");
      r && (r.textContent = this.themeCss);
    }
  }
  disconnectedCallback() {
    x(this, S)?.destroy(), v(this, S, void 0), super.disconnectedCallback();
  }
  getMarkdown() {
    return this.value;
  }
  setMarkdown(t) {
    this.value = t ?? "", this.mode === "source" && (this.documentSourceValue = this.value);
  }
  formResetCallback() {
    this.setMarkdown(x(this, Mt));
  }
  setMode(t) {
    if (!["wysiwyg", "source", "readonly"].includes(t))
      throw new Error(`Unsupported editor mode: ${t}`);
    t === "source" && this.mode !== "source" && v(this, Tt, this.mode), this.mode = t;
  }
  focus(t) {
    if (this.mode === "source") {
      this.updateComplete.then(
        () => this.renderRoot.querySelector("#document-source")?.focus(t)
      );
      return;
    }
    x(this, S)?.focus();
  }
  undo() {
    return x(this, S) ? ar(
      x(this, S).state,
      (t) => x(this, S)?.dispatch(t.setMeta("wysiwygMarkdownSource", "command")),
      x(this, S)
    ) : !1;
  }
  redo() {
    return x(this, S) ? Yt(
      x(this, S).state,
      (t) => x(this, S)?.dispatch(t.setMeta("wysiwygMarkdownSource", "command")),
      x(this, S)
    ) : !1;
  }
  execute(t) {
    if (!x(this, S)) return !1;
    const r = _(this, y, la).call(this)[t];
    return r ? r({
      state: x(this, S).state,
      dispatch: (i) => x(this, S)?.dispatch(i.setMeta("wysiwygMarkdownSource", "command")),
      view: x(this, S)
    }) : !1;
  }
  use(t) {
    x(this, Ne).add(t), _(this, y, Oi).call(this);
  }
  removeExtension(t) {
    const r = x(this, Ne).remove(t);
    return r && _(this, y, Oi).call(this), r;
  }
  getExtensions() {
    return x(this, Ne).list();
  }
  insertText(t) {
    if (!x(this, S) || !_(this, y, ee).call(this)) return !1;
    const { from: r, to: i } = x(this, S).state.selection;
    return x(this, S).dispatch(
      x(this, S).state.tr.insertText(t, r, i).setMeta("wysiwygMarkdownSource", "api")
    ), !0;
  }
  insertMarkdown(t) {
    if (!x(this, S) || !_(this, y, ee).call(this)) return !1;
    const r = _(this, y, Et).call(this, t), { from: i, to: u } = x(this, S).state.selection;
    return x(this, S).dispatch(
      x(this, S).state.tr.replaceWith(i, u, r.content).scrollIntoView().setMeta("wysiwygMarkdownSource", "api")
    ), !0;
  }
  replaceSelection(t) {
    return this.insertMarkdown(t);
  }
  insertImage(t, r = "Image", i = null) {
    if (!x(this, S) || !_(this, y, ee).call(this)) return !1;
    const u = $.nodes.image.create({ src: t, alt: r, title: i });
    return x(this, S).dispatch(
      x(this, S).state.tr.replaceSelectionWith(u).scrollIntoView().setMeta("wysiwygMarkdownSource", "api")
    ), !0;
  }
};
S = new WeakMap(), Ne = new WeakMap(), qe = new WeakMap(), ot = new WeakMap(), He = new WeakMap(), yn = new WeakMap(), kn = new WeakMap(), Cn = new WeakMap(), Dn = new WeakMap(), Sn = new WeakMap(), En = new WeakMap(), lt = new WeakMap(), Mt = new WeakMap(), Tt = new WeakMap(), y = new WeakSet(), Mi = function() {
  if (x(this, S)) return;
  const t = this.renderRoot.querySelector("#editor-mount");
  if (!t) throw new Error("Editor mount element was not created.");
  const r = _(this, y, Et).call(this, this.value);
  v(this, ot, Kn(r)), v(this, Mt, this.value), this.documentSourceValue = this.value, v(this, He, _(this, y, Ti).call(this));
  const i = _t.create({
    doc: r,
    schema: $,
    plugins: x(this, He)
  });
  v(this, S, new Tl(t, {
    state: i,
    editable: () => _(this, y, ee).call(this),
    dispatchTransaction: (u) => _(this, y, aa).call(this, u),
    transformPastedText: (u) => this.transformPastedText?.(u) ?? u,
    handlePaste: (u, s) => _(this, y, ca).call(this, u, s),
    handleDOMEvents: {
      blur: () => (_(this, y, Fi).call(this, "keyboard"), !1)
    },
    nodeViews: {
      code_block: (u) => _(this, y, da).call(this, u),
      image: (u) => _(this, y, ha).call(this, u),
      list_item: (u, s, o) => _(this, y, ba).call(this, u, s, o)
    }
  })), _(this, y, vi).call(this);
}, ee = function() {
  return this.mode === "wysiwyg" && !this.readonly && !this.disabled && !this.blockSourceOpen;
}, Ti = function() {
  return [
    x(this, yn),
    x(this, kn),
    x(this, Cn),
    ...x(this, Ne).plugins(),
    x(this, Sn),
    x(this, Dn),
    x(this, En)
  ];
}, Oi = function() {
  x(this, S) && (v(this, He, _(this, y, Ti).call(this)), x(this, S).updateState(
    x(this, S).state.reconfigure({ plugins: x(this, He) })
  ));
}, la = function() {
  return x(this, Ne).commands(o1);
}, aa = function(t) {
  if (!x(this, S)) return;
  const r = x(this, S).state.apply(t);
  if (x(this, S).updateState(r), t.docChanged) {
    const i = Kn(r.doc);
    if (v(this, ot, i), this.value = i, this.documentSourceValue = i, !t.getMeta("wysiwygMarkdownSilent")) {
      const u = t.getMeta("wysiwygMarkdownSource") ?? (t.getMeta("paste") ? "paste" : "keyboard");
      _(this, y, tr).call(this, u);
    }
  }
  t.selectionSet && this.dispatchEvent(
    new CustomEvent("selection-change", {
      detail: {
        from: r.selection.from,
        to: r.selection.to
      },
      bubbles: !0,
      composed: !0
    })
  );
}, Ni = function(t, r, i = "api") {
  if (!x(this, S)) return;
  const u = _(this, y, Et).call(this, t), s = x(this, S).state.tr.replaceWith(
    0,
    x(this, S).state.doc.content.size,
    u.content
  );
  s.setMeta("wysiwygMarkdownSource", i), s.setMeta("wysiwygMarkdownSilent", !r), i === "api" && s.setMeta("addToHistory", !1), x(this, S).dispatch(s);
}, Et = function(t) {
  try {
    return Js(t);
  } catch (r) {
    return _(this, y, jt).call(this, r, t), Js("");
  }
}, tr = function(t) {
  this.dispatchEvent(
    new CustomEvent("input", {
      detail: { markdown: this.value, source: t },
      bubbles: !0,
      composed: !0
    })
  );
}, Fi = function(t) {
  this.dispatchEvent(
    new CustomEvent("change", {
      detail: { markdown: this.value, source: t },
      bubbles: !0,
      composed: !0
    })
  );
}, vi = function() {
  x(this, lt) && typeof x(this, lt).setFormValue == "function" && x(this, lt).setFormValue(this.disabled ? null : this.value);
}, jt = function(t, r) {
  this.dispatchEvent(
    new CustomEvent("editor-error", {
      detail: { error: t, markdown: r },
      bubbles: !0,
      composed: !0
    })
  );
}, ca = function(t, r) {
  const i = [...r.clipboardData?.files ?? []].find(
    (s) => s.type.startsWith("image/")
  );
  if (!i || !this.uploadImage) return !1;
  r.preventDefault();
  const u = {
    from: t.state.selection.from,
    to: t.state.selection.to
  };
  return _(this, y, fa).call(this, i, u), !0;
}, fa = async function(t, r) {
  if (!(!x(this, S) || !this.uploadImage))
    try {
      const i = await this.uploadImage(t);
      if (!i || !x(this, S)) return;
      const u = $.nodes.image.create({
        src: i,
        alt: t.name || "Image",
        title: null
      }), s = x(this, S).state.doc.content.size, o = Math.min(r.from, s), l = Math.min(r.to, s);
      x(this, S).dispatch(
        x(this, S).state.tr.replaceWith(o, l, u).scrollIntoView().setMeta("wysiwygMarkdownSource", "paste")
      );
    } catch (i) {
      _(this, y, jt).call(this, i, `[image paste: ${t.name}]`);
    }
}, ha = function(t) {
  const r = document.createElement("img");
  let i = t, u = null, s = !1;
  const o = async (l) => {
    r.dataset.source = l, r.alt = i.attrs.alt ?? "", r.title = i.attrs.title ?? "";
    try {
      if (u = this.imageResolver ? await this.imageResolver(l) : l, s) {
        _(this, y, nr).call(this, u);
        return;
      }
      u ? (r.src = u, r.removeAttribute("data-missing")) : (r.removeAttribute("src"), r.dataset.missing = "true", r.alt = i.attrs.alt || `Image not found: ${l}`);
    } catch (a) {
      r.removeAttribute("src"), r.dataset.missing = "true", _(this, y, jt).call(this, a, l);
    }
  };
  return o(i.attrs.src), {
    dom: r,
    update: (l) => l.type !== i.type ? !1 : (_(this, y, nr).call(this, u), u = null, i = l, o(l.attrs.src), !0),
    destroy: () => {
      s = !0, _(this, y, nr).call(this, u);
    }
  };
}, da = function(t) {
  const r = document.createElement("div");
  r.className = "code-block-container";
  const i = document.createElement("div");
  i.className = "code-block-header", i.setAttribute("part", "code-block-header"), i.contentEditable = "false";
  const u = document.createElement("span");
  u.className = "code-block-language", u.setAttribute("part", "code-block-language");
  const s = document.createElement("button");
  s.type = "button", s.className = "copy-code-button", s.setAttribute("part", "copy-code-button"), s.setAttribute("aria-label", "Copy code"), s.title = "Copy code", s.textContent = "📄";
  const o = document.createElement("pre");
  o.className = "code-block-body", o.setAttribute("part", "code-block-body");
  const l = document.createElement("code");
  l.className = "hljs", o.append(l);
  const a = document.createElement("div");
  a.className = "code-block-content";
  const c = document.createElement("div");
  c.className = "code-line-numbers", c.setAttribute("part", "code-line-numbers"), c.setAttribute("aria-hidden", "true"), c.contentEditable = "false", a.append(c, o), i.append(u, s), r.append(i, a);
  let f = t, d;
  const p = () => {
    const b = String(f.attrs.params ?? "").trim().split(/\s+/)[0] || "text";
    u.textContent = b, l.dataset.language = b, i.hidden = !this.showCodeBlockHeader;
    const C = f.textContent.split(`
`), D = this.showCodeLineNumbers && C.length > 1;
    c.replaceChildren(
      ...C.map((A, M) => {
        const O = document.createElement("span");
        return O.textContent = String(M + 1), O;
      })
    ), c.hidden = !D, a.dataset.lineCount = String(C.length), a.toggleAttribute("data-line-numbers", D);
  }, h = (g) => {
    d && clearTimeout(d), s.textContent = g, d = setTimeout(() => {
      s.textContent = "📄", d = void 0;
    }, 1e3);
  }, m = async () => {
    try {
      await _(this, y, pa).call(this, f.textContent), h("✓");
    } catch {
      h("!");
    }
  };
  return s.addEventListener("click", m), p(), {
    dom: r,
    contentDOM: l,
    update: (g) => g.type !== f.type ? !1 : (f = g, p(), !0),
    stopEvent: (g) => i.contains(g.target) || c.contains(g.target),
    destroy: () => {
      d && clearTimeout(d), s.removeEventListener("click", m);
    }
  };
}, pa = async function(t) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(t);
    return;
  }
  const r = document.createElement("textarea");
  r.value = t, r.readOnly = !0, r.style.position = "fixed", r.style.top = "-9999px", document.body.append(r), r.select();
  try {
    if (!document.execCommand("copy"))
      throw new Error("The browser rejected the copy command.");
  } finally {
    r.remove();
  }
}, ma = function() {
  this.renderRoot.querySelectorAll(".code-block-container").forEach(
    (t) => {
      const r = t.querySelector(".code-block-header"), i = t.querySelector(".code-block-content"), u = t.querySelector(".code-line-numbers"), s = this.showCodeLineNumbers && Number(i?.dataset.lineCount ?? 0) > 1;
      r && (r.hidden = !this.showCodeBlockHeader), u && (u.hidden = !s), i?.toggleAttribute("data-line-numbers", s);
    }
  );
}, ga = function(t) {
  if (!this.codeHighlighter) return L.empty;
  const r = [];
  return t.descendants((i, u) => {
    if (i.type !== $.nodes.code_block) return !0;
    const s = String(i.attrs.params ?? "").trim().split(/\s+/)[0] || "text";
    let o;
    try {
      o = this.codeHighlighter?.(i.textContent, s) ?? [];
    } catch {
      return !1;
    }
    for (const l of o) {
      const a = Math.max(0, Math.min(l.from, i.textContent.length)), c = Math.max(a, Math.min(l.to, i.textContent.length));
      a === c || !l.className.trim() || r.push(
        he.inline(u + 1 + a, u + 1 + c, {
          class: l.className
        })
      );
    }
    return !1;
  }), L.create(t, r);
}, nr = function(t) {
  t?.startsWith("blob:") && typeof URL.revokeObjectURL == "function" && URL.revokeObjectURL(t);
}, ba = function(t, r, i) {
  const u = document.createElement("li");
  let s = t;
  if (s.attrs.checked === null)
    return { dom: u, contentDOM: u };
  u.dataset.task = "true";
  const o = document.createElement("input");
  o.type = "checkbox", o.contentEditable = "false", o.setAttribute("aria-label", "Toggle task"), o.checked = !!s.attrs.checked, o.disabled = !_(this, y, ee).call(this);
  const l = document.createElement("div");
  l.className = "task-content", u.append(o, l), u.dataset.checked = o.checked ? "true" : "false";
  const a = () => {
    if (!_(this, y, ee).call(this)) {
      o.checked = !!s.attrs.checked;
      return;
    }
    const c = i();
    typeof c == "number" && r.dispatch(
      r.state.tr.setNodeMarkup(c, void 0, {
        ...s.attrs,
        checked: o.checked
      }).setMeta("wysiwygMarkdownSource", "command")
    );
  };
  return o.addEventListener("change", a), {
    dom: u,
    contentDOM: l,
    update: (c) => c.type !== s.type || c.attrs.checked === null ? !1 : (s = c, o.checked = !!c.attrs.checked, o.disabled = !_(this, y, ee).call(this), u.dataset.checked = o.checked ? "true" : "false", !0),
    stopEvent: (c) => c.target === o,
    destroy: () => o.removeEventListener("change", a)
  };
}, rr = function() {
  this.renderRoot.querySelectorAll('li[data-task] > input[type="checkbox"]').forEach((t) => {
    t.disabled = !_(this, y, ee).call(this);
  });
}, _n = new WeakMap(), wn = new WeakMap(), An = new WeakMap(), Mn = new WeakMap(), Ii = function(t, r, i = t.selectionStart, u = t.selectionEnd) {
  t.value = t.value.slice(0, i) + r + t.value.slice(u);
  const s = i + r.length;
  t.setSelectionRange(s, s), this.documentSourceValue = t.value, this.value = t.value, _(this, y, tr).call(this, "source-edit");
}, Tn = new WeakMap(), On = new WeakMap(), en.formAssociated = !0, en.properties = {
  value: { type: String },
  mode: { type: String, reflect: !0 },
  placeholder: { type: String },
  readonly: { type: Boolean, reflect: !0 },
  disabled: { type: Boolean, reflect: !0 },
  name: { type: String, reflect: !0 },
  sourceEditScope: { type: String, attribute: "source-edit-scope", reflect: !0 },
  showCodeBlockHeader: {
    type: Boolean,
    attribute: "show-code-block-header",
    reflect: !0
  },
  showCodeLineNumbers: {
    type: Boolean,
    attribute: "show-code-line-numbers",
    reflect: !0
  },
  codeHighlighter: { attribute: !1 },
  themeCss: { attribute: !1 },
  blockSourceOpen: { state: !0 },
  blockSourceValue: { state: !0 }
}, en.styles = h1;
let Ai = en;
customElements.get("wysiwyg-markdown") || customElements.define("wysiwyg-markdown", Ai);
export {
  Ai as WysiwygMarkdownElement,
  $ as markdownSchema,
  Js as parseMarkdown,
  Kn as serializeMarkdown
};
//# sourceMappingURL=wysiwyg-markdown.js.map
