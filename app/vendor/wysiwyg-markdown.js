var _u = (n) => {
  throw TypeError(n);
};
var Jr = (n, e, t) => e.has(n) || _u("Cannot " + t);
var b = (n, e, t) => (Jr(n, e, "read from private field"), t ? t.call(n) : e.get(n)), $ = (n, e, t) => e.has(n) ? _u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(n) : e.set(n, t), N = (n, e, t, r) => (Jr(n, e, "write to private field"), r ? r.call(n, t) : e.set(n, t), t), S = (n, e, t) => (Jr(n, e, "access private method"), t);
const ar = globalThis, Yi = ar.ShadowRoot && (ar.ShadyCSS === void 0 || ar.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Xi = /* @__PURE__ */ Symbol(), Au = /* @__PURE__ */ new WeakMap();
let ao = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Xi) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Yi && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Au.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Au.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const qa = (n) => new ao(typeof n == "string" ? n : n + "", void 0, Xi), Ha = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((r, i, u) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[u + 1], n[0]);
  return new ao(t, n, Xi);
}, Ua = (n, e) => {
  if (Yi) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = ar.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
  }
}, Mu = Yi ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return qa(t);
})(n) : n;
const { is: Wa, defineProperty: ja, getOwnPropertyDescriptor: Ja, getOwnPropertyNames: Ka, getOwnPropertySymbols: Za, getPrototypeOf: Ga } = Object, Nr = globalThis, Tu = Nr.trustedTypes, Ya = Tu ? Tu.emptyScript : "", Xa = Nr.reactiveElementPolyfillSupport, sn = (n, e) => n, Ei = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? Ya : null;
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
} }, co = (n, e) => !Wa(n, e), Ou = { attribute: !0, type: String, converter: Ei, reflect: !1, useDefault: !1, hasChanged: co };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Nr.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Ot = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ou) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && ja(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: u } = Ja(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? Ou;
  }
  static _$Ei() {
    if (this.hasOwnProperty(sn("elementProperties"))) return;
    const e = Ga(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(sn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(sn("properties"))) {
      const t = this.properties, r = [...Ka(t), ...Za(t)];
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
      for (const i of r) t.unshift(Mu(i));
    } else e !== void 0 && t.push(Mu(e));
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
    return Ua(e, this.constructor.elementStyles), e;
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
      const u = (r.converter?.toAttribute !== void 0 ? r.converter : Ei).toAttribute(t, r.type);
      this._$Em = e, u == null ? this.removeAttribute(i) : this.setAttribute(i, u), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const u = r.getPropertyOptions(i), s = typeof u.converter == "function" ? { fromAttribute: u.converter } : u.converter?.fromAttribute !== void 0 ? u.converter : Ei;
      this._$Em = i;
      const o = s.fromAttribute(t, u.type);
      this[i] = o ?? this._$Ej?.get(i) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, i = !1, u) {
    if (e !== void 0) {
      const s = this.constructor;
      if (i === !1 && (u = this[e]), r ??= s.getPropertyOptions(e), !((r.hasChanged ?? co)(u, t) || r.useDefault && r.reflect && u === this._$Ej?.get(e) && !this.hasAttribute(s._$Eu(e, r)))) return;
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
Ot.elementStyles = [], Ot.shadowRootOptions = { mode: "open" }, Ot[sn("elementProperties")] = /* @__PURE__ */ new Map(), Ot[sn("finalized")] = /* @__PURE__ */ new Map(), Xa?.({ ReactiveElement: Ot }), (Nr.reactiveElementVersions ??= []).push("2.1.2");
const Qi = globalThis, Nu = (n) => n, br = Qi.trustedTypes, Fu = br ? br.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, fo = "$lit$", je = `lit$${Math.random().toFixed(9).slice(2)}$`, ho = "?" + je, Qa = `<${ho}>`, Et = document, mn = () => Et.createComment(""), gn = (n) => n === null || typeof n != "object" && typeof n != "function", eu = Array.isArray, ec = (n) => eu(n) || typeof n?.[Symbol.iterator] == "function", Kr = `[ 	
\f\r]`, Yt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vu = /-->/g, Iu = />/g, ct = RegExp(`>|${Kr}(?:([^\\s"'>=/]+)(${Kr}*=${Kr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ru = /'/g, Pu = /"/g, po = /^(?:script|style|textarea|title)$/i, tc = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), Zr = tc(1), Vt = /* @__PURE__ */ Symbol.for("lit-noChange"), V = /* @__PURE__ */ Symbol.for("lit-nothing"), $u = /* @__PURE__ */ new WeakMap(), ht = Et.createTreeWalker(Et, 129);
function mo(n, e) {
  if (!eu(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Fu !== void 0 ? Fu.createHTML(e) : e;
}
const nc = (n, e) => {
  const t = n.length - 1, r = [];
  let i, u = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = Yt;
  for (let o = 0; o < t; o++) {
    const l = n[o];
    let a, c, f = -1, h = 0;
    for (; h < l.length && (s.lastIndex = h, c = s.exec(l), c !== null); ) h = s.lastIndex, s === Yt ? c[1] === "!--" ? s = vu : c[1] !== void 0 ? s = Iu : c[2] !== void 0 ? (po.test(c[2]) && (i = RegExp("</" + c[2], "g")), s = ct) : c[3] !== void 0 && (s = ct) : s === ct ? c[0] === ">" ? (s = i ?? Yt, f = -1) : c[1] === void 0 ? f = -2 : (f = s.lastIndex - c[2].length, a = c[1], s = c[3] === void 0 ? ct : c[3] === '"' ? Pu : Ru) : s === Pu || s === Ru ? s = ct : s === vu || s === Iu ? s = Yt : (s = ct, i = void 0);
    const p = s === ct && n[o + 1].startsWith("/>") ? " " : "";
    u += s === Yt ? l + Qa : f >= 0 ? (r.push(a), l.slice(0, f) + fo + l.slice(f) + je + p) : l + je + (f === -2 ? o : p);
  }
  return [mo(n, u + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class bn {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let u = 0, s = 0;
    const o = e.length - 1, l = this.parts, [a, c] = nc(e, t);
    if (this.el = bn.createElement(a, r), ht.currentNode = this.el.content, t === 2 || t === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (i = ht.nextNode()) !== null && l.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const f of i.getAttributeNames()) if (f.endsWith(fo)) {
          const h = c[s++], p = i.getAttribute(f).split(je), d = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: u, name: d[2], strings: p, ctor: d[1] === "." ? ic : d[1] === "?" ? uc : d[1] === "@" ? sc : Fr }), i.removeAttribute(f);
        } else f.startsWith(je) && (l.push({ type: 6, index: u }), i.removeAttribute(f));
        if (po.test(i.tagName)) {
          const f = i.textContent.split(je), h = f.length - 1;
          if (h > 0) {
            i.textContent = br ? br.emptyScript : "";
            for (let p = 0; p < h; p++) i.append(f[p], mn()), ht.nextNode(), l.push({ type: 2, index: ++u });
            i.append(f[h], mn());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ho) l.push({ type: 2, index: u });
      else {
        let f = -1;
        for (; (f = i.data.indexOf(je, f + 1)) !== -1; ) l.push({ type: 7, index: u }), f += je.length - 1;
      }
      u++;
    }
  }
  static createElement(e, t) {
    const r = Et.createElement("template");
    return r.innerHTML = e, r;
  }
}
function qt(n, e, t = n, r) {
  if (e === Vt) return e;
  let i = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const u = gn(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== u && (i?._$AO?.(!1), u === void 0 ? i = void 0 : (i = new u(n), i._$AT(n, t, r)), r !== void 0 ? (t._$Co ??= [])[r] = i : t._$Cl = i), i !== void 0 && (e = qt(n, i._$AS(n, e.values), i, r)), e;
}
class rc {
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
    const { el: { content: t }, parts: r } = this._$AD, i = (e?.creationScope ?? Et).importNode(t, !0);
    ht.currentNode = i;
    let u = ht.nextNode(), s = 0, o = 0, l = r[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let a;
        l.type === 2 ? a = new jn(u, u.nextSibling, this, e) : l.type === 1 ? a = new l.ctor(u, l.name, l.strings, this, e) : l.type === 6 && (a = new oc(u, this, e)), this._$AV.push(a), l = r[++o];
      }
      s !== l?.index && (u = ht.nextNode(), s++);
    }
    return ht.currentNode = Et, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class jn {
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
    e = qt(this, e, t), gn(e) ? e === V || e == null || e === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : e !== this._$AH && e !== Vt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ec(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== V && gn(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Et.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = bn.createElement(mo(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const u = new rc(i, this), s = u.u(this.options);
      u.p(t), this.T(s), this._$AH = u;
    }
  }
  _$AC(e) {
    let t = $u.get(e.strings);
    return t === void 0 && $u.set(e.strings, t = new bn(e)), t;
  }
  k(e) {
    eu(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const u of e) i === t.length ? t.push(r = new jn(this.O(mn()), this.O(mn()), this, this.options)) : r = t[i], r._$AI(u), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = Nu(e).nextSibling;
      Nu(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Fr {
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
    if (u === void 0) e = qt(this, e, t, 0), s = !gn(e) || e !== this._$AH && e !== Vt, s && (this._$AH = e);
    else {
      const o = e;
      let l, a;
      for (e = u[0], l = 0; l < u.length - 1; l++) a = qt(this, o[r + l], t, l), a === Vt && (a = this._$AH[l]), s ||= !gn(a) || a !== this._$AH[l], a === V ? e = V : e !== V && (e += (a ?? "") + u[l + 1]), this._$AH[l] = a;
    }
    s && !i && this.j(e);
  }
  j(e) {
    e === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ic extends Fr {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === V ? void 0 : e;
  }
}
class uc extends Fr {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== V);
  }
}
class sc extends Fr {
  constructor(e, t, r, i, u) {
    super(e, t, r, i, u), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = qt(this, e, t, 0) ?? V) === Vt) return;
    const r = this._$AH, i = e === V && r !== V || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, u = e !== V && (r === V || i);
    i && this.element.removeEventListener(this.name, this, r), u && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
let oc = class {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    qt(this, e);
  }
};
const lc = Qi.litHtmlPolyfillSupport;
lc?.(bn, jn), (Qi.litHtmlVersions ??= []).push("3.3.3");
const ac = (n, e, t) => {
  const r = t?.renderBefore ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const u = t?.renderBefore ?? null;
    r._$litPart$ = i = new jn(e.insertBefore(mn(), u), u, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
const tu = globalThis;
let on = class extends Ot {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ac(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Vt;
  }
};
on._$litElement$ = !0, on.finalized = !0, tu.litElementHydrateSupport?.({ LitElement: on });
const cc = tu.litElementPolyfillSupport;
cc?.({ LitElement: on });
(tu.litElementVersions ??= []).push("4.2.2");
function G(n) {
  this.content = n;
}
G.prototype = {
  constructor: G,
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
    return i == -1 ? u.push(t || n, e) : (u[i + 1] = e, t && (u[i] = t)), new G(u);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new G(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new G([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new G(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), u = r.find(n);
    return i.splice(u == -1 ? i.length : u, 0, e, t), new G(i);
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
    return n = G.from(n), n.size ? new G(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = G.from(n), n.size ? new G(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = G.from(n);
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
G.from = function(n) {
  if (n instanceof G) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new G(e);
};
function go(n, e, t) {
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
      return l && l < s.length && l < o.length && yo(s.charCodeAt(l - 1)) && xo(s.charCodeAt(l)) && t--, t;
    }
    if (i.content.size || u.content.size) {
      let s = go(i.content, u.content, t + 1);
      if (s != null)
        return s;
    }
    t += i.nodeSize;
  }
}
function bo(n, e, t, r) {
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
      let a = s.text, c = o.text, f = a.length, h = c.length;
      for (; f > 0 && h > 0 && a[f - 1] == c[h - 1]; )
        f--, h--, t--, r--;
      return f && h && f < a.length && yo(a.charCodeAt(f - 1)) && xo(a.charCodeAt(f)) && (t++, r++), { a: t, b: r };
    }
    if (s.content.size || o.content.size) {
      let a = bo(s.content, o.content, t - 1, r - 1);
      if (a)
        return a;
    }
    t -= l, r -= l;
  }
}
function xo(n) {
  return n >= 56320 && n < 57344;
}
function yo(n) {
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
    return go(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return bo(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return tr(0, e);
    if (e == this.size)
      return tr(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), u = r + i.nodeSize;
      if (u >= e)
        return u == e ? tr(t + 1, u) : tr(t, r);
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
const Gr = { index: 0, offset: 0 };
function tr(n, e) {
  return Gr.index = n, Gr.offset = e, Gr;
}
function xr(n, e) {
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
      if (!xr(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !xr(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
class R {
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
    return this == e || this.type == e.type && xr(this.attrs, e.attrs);
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
      return R.none;
    if (e instanceof R)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
}
R.none = [];
class xn extends Error {
}
class w {
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
    let r = Co(this.content, e + this.openStart, t, this.openStart + 1, this.openEnd + 1);
    return r && new w(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new w(ko(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return w.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new w(k.fromJSON(e, t.content), r, i);
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
    return new w(e, r, i);
  }
}
w.empty = new w(k.empty, 0, 0);
function ko(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), u = n.maybeChild(r), { index: s, offset: o } = n.findIndex(t);
  if (i == e || u.isText) {
    if (o != t && !n.child(s).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != s)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, u.copy(ko(u.content, e - i - 1, t - i - 1)));
}
function Co(n, e, t, r, i, u) {
  let { index: s, offset: o } = n.findIndex(e), l = n.maybeChild(s);
  if (o == e || l.isText)
    return u && r <= 0 && i <= 0 && !u.canReplace(s, s, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = Co(l.content, e - o - 1, t, s == 0 ? r - 1 : 0, s == n.childCount - 1 ? i - 1 : 0, l);
  return a && n.replaceChild(s, l.copy(a));
}
function fc(n, e, t) {
  if (t.openStart > n.depth)
    throw new xn("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new xn("Inconsistent open depths");
  return So(n, e, t, 0);
}
function So(n, e, t, r) {
  let i = n.index(r), u = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let s = So(n, e, t, r + 1);
    return u.copy(u.content.replaceChild(i, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let s = n.parent, o = s.content;
      return yt(s, o.cut(0, n.parentOffset).append(t.content).append(o.cut(e.parentOffset)));
    } else {
      let { start: s, end: o } = dc(t, n);
      return yt(u, Do(n, s, o, e, r));
    }
  else return yt(u, yr(n, e, r));
}
function Eo(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new xn("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Di(n, e, t) {
  let r = n.node(t);
  return Eo(r, e.node(t)), r;
}
function xt(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function ln(n, e, t, r) {
  let i = (e || n).node(t), u = 0, s = e ? e.index(t) : i.childCount;
  n && (u = n.index(t), n.depth > t ? u++ : n.textOffset && (xt(n.nodeAfter, r), u++));
  for (let o = u; o < s; o++)
    xt(i.child(o), r);
  e && e.depth == t && e.textOffset && xt(e.nodeBefore, r);
}
function yt(n, e) {
  if (!n.type.validContent(e))
    throw new xn("Invalid content for node " + n.type.name);
  return n.copy(e);
}
function Do(n, e, t, r, i) {
  let u = n.depth > i && Di(n, e, i + 1), s = r.depth > i && Di(t, r, i + 1), o = [];
  return ln(null, n, i, o), u && s && e.index(i) == t.index(i) ? (Eo(u, s), xt(yt(u, Do(n, e, t, r, i + 1)), o)) : (u && xt(yt(u, yr(n, e, i + 1)), o), ln(e, t, i, o), s && xt(yt(s, yr(t, r, i + 1)), o)), ln(r, null, i, o), new k(o);
}
function yr(n, e, t) {
  let r = [];
  if (ln(null, n, t, r), n.depth > t) {
    let i = Di(n, e, t + 1);
    xt(yt(i, yr(n, e, t + 1)), r);
  }
  return ln(e, null, t, r), new k(r);
}
function dc(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let u = t - 1; u >= 0; u--)
    i = e.node(u).copy(k.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class yn {
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
      return R.none;
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
        return new wo(this, e, r);
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
    return new yn(t, r, u);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = zu.get(e);
    if (r)
      for (let u = 0; u < r.elts.length; u++) {
        let s = r.elts[u];
        if (s.pos == t)
          return s;
      }
    else
      zu.set(e, r = new hc());
    let i = r.elts[r.i] = yn.resolve(e, t);
    return r.i = (r.i + 1) % pc, i;
  }
}
class hc {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const pc = 12, zu = /* @__PURE__ */ new WeakMap();
class wo {
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
const mc = /* @__PURE__ */ Object.create(null);
class _e {
  /**
  @internal
  */
  constructor(e, t, r, i = R.none) {
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
    return this.type == e && xr(this.attrs, t || e.defaultAttrs || mc) && R.sameSet(this.marks, r || R.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new _e(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new _e(this.type, this.attrs, this.content, e);
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
      return w.empty;
    let i = this.resolve(e), u = this.resolve(t), s = r ? 0 : i.sharedDepth(t), o = i.start(s), a = i.node(s).content.cut(i.pos - o, u.pos - o);
    return new w(a, i.depth - s, u.depth - s);
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
    return fc(this.resolve(e), this.resolve(t), r);
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
    return yn.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return yn.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), _o(this.marks, e);
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
    let e = R.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!R.sameSet(e, this.marks))
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
_e.prototype.text = void 0;
class kr extends _e {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : _o(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new kr(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new kr(this.type, this.attrs, e, this.marks);
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
function _o(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class Dt {
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
    let r = new gc(e, t);
    if (r.next == null)
      return Dt.empty;
    let i = Ao(r);
    r.next && r.err("Unexpected trailing text");
    let u = Ec(Sc(i));
    return Dc(u, r), u;
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
          let h = u(f, o.concat(c));
          if (h)
            return h;
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
Dt.empty = new Dt(!0);
class gc {
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
function Ao(n) {
  let e = [];
  do
    e.push(bc(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function bc(n) {
  let e = [];
  do
    e.push(xc(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function xc(n) {
  let e = Cc(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = yc(n, e);
    else
      break;
  return e;
}
function Bu(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function yc(n, e) {
  let t = Bu(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Bu(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function kc(n, e) {
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
function Cc(n) {
  if (n.eat("(")) {
    let e = Ao(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = kc(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Sc(n) {
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
function Mo(n, e) {
  return e - n;
}
function Lu(n, e) {
  let t = [];
  return r(e), t.sort(Mo);
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
function Ec(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Lu(n, 0));
  function t(r) {
    let i = [];
    r.forEach((s) => {
      n[s].forEach(({ term: o, to: l }) => {
        if (!o)
          return;
        let a;
        for (let c = 0; c < i.length; c++)
          i[c][0] == o && (a = i[c][1]);
        Lu(n, l).forEach((c) => {
          a || i.push([o, a = []]), a.indexOf(c) == -1 && a.push(c);
        });
      });
    });
    let u = e[r.join(",")] = new Dt(r.indexOf(n.length - 1) > -1);
    for (let s = 0; s < i.length; s++) {
      let o = i[s][1].sort(Mo);
      u.next.push({ type: i[s][0], next: e[o.join(",")] || t(o) });
    }
    return u;
  }
}
function Dc(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], u = !i.validEnd, s = [];
    for (let o = 0; o < i.next.length; o++) {
      let { type: l, next: a } = i.next[o];
      s.push(l.name), u && !(l.isText || l.hasRequiredAttrs()) && (u = !1), r.indexOf(a) == -1 && r.push(a);
    }
    u && e.err("Only non-generatable nodes (" + s.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function To(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Oo(n, e) {
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
function No(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${r}`);
  for (let i in n)
    n[i].validate && n[i].validate(e[i]);
}
function Fo(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new _c(n, r, e[r]);
  return t;
}
let Vu = class vo {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Fo(e, r.attrs), this.defaultAttrs = To(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == Dt.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : Oo(this.attrs, e);
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
    return new _e(this, this.computeAttrs(e), k.from(t), R.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = k.from(t), this.checkContent(t), new _e(this, this.computeAttrs(e), t, R.setFrom(r));
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
    return u ? new _e(this, e, t.append(u), R.setFrom(r)) : null;
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
    No(this.attrs, e, "node", this.name);
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
    return t ? t.length ? t : R.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((u, s) => r[u] = new vo(u, t, s));
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
function wc(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let u = i === null ? "null" : typeof i;
    if (r.indexOf(u) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${u}`);
  };
}
class _c {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? wc(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class vr {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = Fo(e, i.attrs), this.excluded = null;
    let u = To(this.attrs);
    this.instance = u ? new R(this, u) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new R(this, Oo(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((u, s) => r[u] = new vr(u, i++, t, s)), r;
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
    No(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Io {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = G.from(e.nodes), t.marks = G.from(e.marks || {}), this.nodes = Vu.compile(this.spec.nodes, this), this.marks = vr.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let u = this.nodes[i], s = u.spec.content || "", o = u.spec.marks;
      if (u.contentMatch = r[s] || (r[s] = Dt.parse(s, this.nodes)), u.inlineContent = u.contentMatch.inlineContent, u.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!u.isInline || !u.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = u;
      }
      u.markSet = o == "_" ? null : o ? qu(this, o.split(" ")) : o == "" || !u.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let u = this.marks[i], s = u.spec.excludes;
      u.excluded = s == null ? [u] : s == "" ? [] : qu(this, s.split(" "));
    }
    this.nodeFromJSON = (i) => _e.fromJSON(this, i), this.markFromJSON = (i) => R.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    else if (e instanceof Vu) {
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
    return new kr(r, r.defaultAttrs, e, R.setFrom(t));
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
function qu(n, e) {
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
function Ac(n) {
  return n.tag != null;
}
function Mc(n) {
  return n.style != null;
}
class kn {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (Ac(i))
        this.tags.push(i);
      else if (Mc(i)) {
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
    let r = new Uu(this, t, !1);
    return r.addAll(e, R.none, t.from, t.to), r.finish();
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
    let r = new Uu(this, t, !0);
    return r.addAll(e, R.none, t.from, t.to), w.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let u = this.tags[i];
      if (Nc(e, u.tag) && (u.namespace === void 0 || e.namespaceURI == u.namespace) && (!u.context || t.matchesContext(u.context))) {
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
        r(s = Wu(s)), s.mark || s.ignore || s.clearMark || (s.mark = i);
      });
    }
    for (let i in e.nodes) {
      let u = e.nodes[i].spec.parseDOM;
      u && u.forEach((s) => {
        r(s = Wu(s)), s.node || s.ignore || s.mark || (s.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new kn(e, kn.schemaRules(e)));
  }
}
const Ro = {
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
}, Tc = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Po = { ol: !0, ul: !0 }, Cn = 1, wi = 2, an = 4;
function Hu(n, e, t) {
  return e != null ? (e ? Cn : 0) | (e === "full" ? wi : 0) : n && n.whitespace == "pre" ? Cn | wi : t & ~an;
}
class nr {
  constructor(e, t, r, i, u, s) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = s, this.content = [], this.activeMarks = R.none, this.match = u || (s & an ? null : e.contentMatch);
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
    if (!(this.options & Cn)) {
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
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Ro.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Uu {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, u, s = Hu(null, t.preserveWhitespace, 0) | (r ? an : 0);
    i ? u = new nr(i.type, i.attrs, R.none, !0, t.topMatch || i.type.contentMatch, s) : r ? u = new nr(null, null, R.none, !0, null, s) : u = new nr(e.schema.topNodeType, null, R.none, !0, null, s), this.nodes = [u], this.find = t.findPositions, this.needsBlock = !1;
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
    let r = e.nodeValue, i = this.top, u = i.options & wi ? "full" : this.localPreserveWS || (i.options & Cn) > 0, { schema: s } = this.parser;
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
    Po.hasOwnProperty(s) && this.parser.normalizeLists && Oc(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : Tc.hasOwnProperty(s))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let a, c = this.needsBlock;
      if (Ro.hasOwnProperty(s))
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
      let s = R.none;
      for (let o of i.concat(e.marks))
        (u.type ? u.type.allowsMarkType(o.type) : ju(o.type, e.type)) && (s = o.addToSet(s));
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
    let o = Hu(e, u, s.options);
    s.options & an && s.content.length == 0 && (o |= an);
    let l = R.none;
    return r = r.filter((a) => (s.type ? s.type.allowsMarkType(a.type) : ju(a.type, e)) ? (l = a.addToSet(l), !1) : !0), this.nodes.push(new nr(e, t, l, i, null, o)), this.open++, r;
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
      this.localPreserveWS && (this.nodes[t].options |= Cn);
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
function Oc(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Po.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Nc(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Wu(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function ju(n, e) {
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
class Zt {
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
    r || (r = rr(t).createDocumentFragment());
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
      return rr(t).createTextNode(e.text);
    let { dom: r, contentDOM: i } = cr(rr(t), this.nodes[e.type.name](e), null, e.attrs);
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
    return i && cr(rr(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return typeof t == "string" ? { dom: e.createTextNode(t) } : cr(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Zt(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Ju(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Ju(e.marks);
  }
}
function Ju(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function rr(n) {
  return n.document || window.document;
}
const Ku = /* @__PURE__ */ new WeakMap();
function Fc(n) {
  let e = Ku.get(n);
  return e === void 0 && Ku.set(n, e = vc(n)), e;
}
function vc(n) {
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
function cr(n, e, t, r) {
  if (e.nodeType == 1)
    return { dom: e };
  if (e.dom && e.dom.nodeType == 1)
    return e;
  let i = e[0], u;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (u = Fc(r)) && u.indexOf(e) > -1)
    throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
  let s = i.indexOf(" ");
  s > 0 && (t = i.slice(0, s), i = i.slice(s + 1));
  let o, l = t ? n.createElementNS(t, i) : n.createElement(i), a = e[1], c = 1;
  if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
    c = 2;
    for (let f in a)
      if (a[f] != null) {
        let h = f.indexOf(" ");
        h > 0 ? l.setAttributeNS(f.slice(0, h), f.slice(h + 1), a[f]) : f == "style" && l.style ? l.style.cssText = a[f] : l.setAttribute(f, a[f]);
      }
  }
  for (let f = c; f < e.length; f++) {
    let h = e[f];
    if (h === 0) {
      if (f < e.length - 1 || f > c)
        throw new RangeError("Content hole must be the only child of its parent node");
      return { dom: l, contentDOM: l };
    } else if (typeof h == "string")
      l.appendChild(n.createTextNode(h));
    else {
      let { dom: p, contentDOM: d } = cr(n, h, t, r);
      if (l.appendChild(p), d) {
        if (o)
          throw new RangeError("Multiple content holes");
        o = d;
      }
    }
  }
  return { dom: l, contentDOM: o };
}
const $o = 65535, zo = Math.pow(2, 16);
function Ic(n, e) {
  return n + e * zo;
}
function Zu(n) {
  return n & $o;
}
function Rc(n) {
  return (n - (n & $o)) / zo;
}
const Bo = 1, Lo = 2, fr = 4, Vo = 8;
class _i {
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
    return (this.delInfo & Vo) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Bo | fr)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Lo | fr)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & fr) > 0;
  }
}
class oe {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && oe.empty)
      return oe.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Zu(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + Rc(e);
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
        let h = a ? e == l ? -1 : e == f ? 1 : t : t, p = l + i + (h < 0 ? 0 : c);
        if (r)
          return p;
        let d = e == (t < 0 ? l : f) ? null : Ic(o / 3, e - l), m = e == l ? Lo : e == f ? Bo : fr;
        return (t < 0 ? e != l : e != f) && (m |= Vo), new _i(p, m, d);
      }
      i += c - a;
    }
    return r ? e + i : new _i(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = Zu(t), u = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
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
    return new oe(this.ranges, !this.inverted);
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
    return e == 0 ? oe.empty : new oe(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
oe.empty = new oe([]);
class Sn {
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
    return new Sn(this._maps, this.mirror, e, t);
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
    let e = new Sn();
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
    return r ? e : new _i(e, i, null);
  }
}
const Yr = /* @__PURE__ */ Object.create(null);
class ne {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return oe.empty;
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
    let r = Yr[t.stepType];
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
    if (e in Yr)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Yr[e] = t, t.prototype.jsonID = e, t;
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
      if (u instanceof xn)
        return q.fail(u.message);
      throw u;
    }
  }
}
function nu(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let u = n.child(i);
    u.content.size && (u = u.copy(nu(u.content, e, u))), u.isInline && (u = e(u, t, i)), r.push(u);
  }
  return k.fromArray(r);
}
class Xe extends ne {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), u = new w(nu(t.content, (s, o) => !s.isAtom || !o.type.allowsMarkType(this.mark.type) ? s : s.mark(this.mark.addToSet(s.marks)), i), t.openStart, t.openEnd);
    return q.fromReplace(e, this.from, this.to, u);
  }
  invert() {
    return new Ee(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Xe(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Xe && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Xe(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Xe(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ne.jsonID("addMark", Xe);
class Ee extends ne {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new w(nu(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return q.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Xe(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Ee(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ee && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Ee(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Ee(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ne.jsonID("removeMark", Ee);
class Qe extends ne {
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
    return q.fromReplace(e, this.pos, this.pos + 1, new w(k.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new Qe(this.pos, t.marks[i]);
        return new Qe(this.pos, this.mark);
      }
    }
    return new wt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Qe(t.pos, this.mark);
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
    return new Qe(t.pos, e.markFromJSON(t.mark));
  }
}
ne.jsonID("addNodeMark", Qe);
class wt extends ne {
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
    return q.fromReplace(e, this.pos, this.pos + 1, new w(k.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Qe(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new wt(t.pos, this.mark);
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
    return new wt(t.pos, e.markFromJSON(t.mark));
  }
}
ne.jsonID("removeNodeMark", wt);
class W extends ne {
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
    return this.structure && Ai(e, this.from, this.to) ? q.fail("Structure replace would overwrite content") : q.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new oe([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new W(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.to, -1), r = this.from == this.to && W.MAP_BIAS < 0 ? t : e.mapResult(this.from, 1);
    return r.deletedAcross && t.deletedAcross ? null : new W(r.pos, Math.max(r.pos, t.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof W) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? w.empty : new w(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new W(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? w.empty : new w(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new W(e.from, this.to, t, this.structure);
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
    return new W(t.from, t.to, w.fromJSON(e, t.slice), !!t.structure);
  }
}
W.MAP_BIAS = 1;
ne.jsonID("replace", W);
class ee extends ne {
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
    if (this.structure && (Ai(e, this.from, this.gapFrom) || Ai(e, this.gapTo, this.to)))
      return q.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return q.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? q.fromReplace(e, this.from, this.to, r) : q.fail("Content does not fit in gap");
  }
  getMap() {
    return new oe([
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
    return new ee(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), u = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || u > r.pos ? null : new ee(t.pos, r.pos, i, u, this.slice, this.insert, this.structure);
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
    return new ee(t.from, t.to, t.gapFrom, t.gapTo, w.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
ne.jsonID("replaceAround", ee);
function Ai(n, e, t) {
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
function Pc(n, e, t, r) {
  let i = [], u = [], s, o;
  n.doc.nodesBetween(e, t, (l, a, c) => {
    if (!l.isInline)
      return;
    let f = l.marks;
    if (!r.isInSet(f) && c.type.allowsMarkType(r.type)) {
      let h = Math.max(a, e), p = Math.min(a + l.nodeSize, t), d = r.addToSet(f);
      for (let m = 0; m < f.length; m++)
        f[m].isInSet(d) || (s && s.to == h && s.mark.eq(f[m]) ? s.to = p : i.push(s = new Ee(h, p, f[m])));
      o && o.to == h ? o.to = p : u.push(o = new Xe(h, p, r));
    }
  }), i.forEach((l) => n.step(l)), u.forEach((l) => n.step(l));
}
function $c(n, e, t, r) {
  let i = [], u = 0;
  n.doc.nodesBetween(e, t, (s, o) => {
    if (!s.isInline)
      return;
    u++;
    let l = null;
    if (r instanceof vr) {
      let a = s.marks, c;
      for (; c = r.isInSet(a); )
        (l || (l = [])).push(c), a = c.removeFromSet(a);
    } else r ? r.isInSet(s.marks) && (l = [r]) : l = s.marks;
    if (l && l.length) {
      let a = Math.min(o + s.nodeSize, t);
      for (let c = 0; c < l.length; c++) {
        let f = l[c], h;
        for (let p = 0; p < i.length; p++) {
          let d = i[p];
          d.step == u - 1 && f.eq(i[p].style) && (h = d);
        }
        h ? (h.to = a, h.step = u) : i.push({ style: f, from: Math.max(o, e), to: a, step: u });
      }
    }
  }), i.forEach((s) => n.step(new Ee(s.from, s.to, s.style)));
}
function ru(n, e, t, r = t.contentMatch, i = !0) {
  let u = n.doc.nodeAt(e), s = [], o = e + 1;
  for (let l = 0; l < u.childCount; l++) {
    let a = u.child(l), c = o + a.nodeSize, f = r.matchType(a.type);
    if (!f)
      s.push(new W(o, c, w.empty));
    else {
      r = f;
      for (let h = 0; h < a.marks.length; h++)
        t.allowsMarkType(a.marks[h].type) || n.step(new Ee(o, c, a.marks[h]));
      if (i && a.isText && t.whitespace != "pre") {
        let h, p = /\r?\n|\r/g, d;
        for (; h = p.exec(a.text); )
          d || (d = new w(k.from(t.schema.text(" ", t.allowedMarks(a.marks))), 0, 0)), s.push(new W(o + h.index, o + h.index + h[0].length, d));
      }
    }
    o = c;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(k.empty, !0);
    n.replace(o, o, new w(l, 0, 0));
  }
  for (let l = s.length - 1; l >= 0; l--)
    n.step(s[l]);
}
function zc(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Ir(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, u = 0; ; --r) {
    let s = n.$from.node(r), o = n.$from.index(r) + i, l = n.$to.indexAfter(r) - u;
    if (r < n.depth && s.canReplace(o, l, t))
      return r;
    if (r == 0 || s.type.spec.isolating || !zc(s, o, l))
      break;
    o && (i = 1), l < s.childCount && (u = 1);
  }
  return null;
}
function Bc(n, e, t) {
  let { $from: r, $to: i, depth: u } = e, s = r.before(u + 1), o = i.after(u + 1), l = s, a = o, c = k.empty, f = 0;
  for (let d = u, m = !1; d > t; d--)
    m || r.index(d) > 0 ? (m = !0, c = k.from(r.node(d).copy(c)), f++) : l--;
  let h = k.empty, p = 0;
  for (let d = u, m = !1; d > t; d--)
    m || i.after(d + 1) < i.end(d) ? (m = !0, h = k.from(i.node(d).copy(h)), p++) : a++;
  n.step(new ee(l, a, s, o, new w(c.append(h), f, p), c.size - f, !0));
}
function qo(n, e, t = null, r = n) {
  let i = Lc(n, e), u = i && Vc(r, e);
  return u ? i.map(Gu).concat({ type: e, attrs: t }).concat(u.map(Gu)) : null;
}
function Gu(n) {
  return { type: n, attrs: null };
}
function Lc(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, u = t.contentMatchAt(r).findWrapping(e);
  if (!u)
    return null;
  let s = u.length ? u[0] : e;
  return t.canReplaceWith(r, i, s) ? u : null;
}
function Vc(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, u = t.child(r), s = e.contentMatch.findWrapping(u.type);
  if (!s)
    return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let a = r; l && a < i; a++)
    l = l.matchType(t.child(a).type);
  return !l || !l.validEnd ? null : s;
}
function qc(n, e, t) {
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
  n.step(new ee(i, u, i, u, new w(r, 0, 0), t.length, !0));
}
function Hc(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let u = n.steps.length;
  n.doc.nodesBetween(e, t, (s, o) => {
    let l = typeof i == "function" ? i(s) : i;
    if (s.isTextblock && !s.hasMarkup(r, l) && Uc(n.doc, n.mapping.slice(u).map(o), r)) {
      let a = null;
      if (r.schema.linebreakReplacement) {
        let p = r.whitespace == "pre", d = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        p && !d ? a = !1 : !p && d && (a = !0);
      }
      a === !1 && Uo(n, s, o, u), ru(n, n.mapping.slice(u).map(o, 1), r, void 0, a === null);
      let c = n.mapping.slice(u), f = c.map(o, 1), h = c.map(o + s.nodeSize, 1);
      return n.step(new ee(f, h, f + 1, h - 1, new w(k.from(r.create(l, null, s.marks)), 0, 0), 1, !0)), a === !0 && Ho(n, s, o, u), !1;
    }
  });
}
function Ho(n, e, t, r) {
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
function Uo(n, e, t, r) {
  e.forEach((i, u) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let s = n.mapping.slice(r).map(t + 1 + u);
      n.replaceWith(s, s + 1, e.type.schema.text(`
`));
    }
  });
}
function Uc(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function Wc(n, e, t, r, i) {
  let u = n.doc.nodeAt(e);
  if (!u)
    throw new RangeError("No node at given position");
  t || (t = u.type);
  let s = t.create(r, null, i || u.marks);
  if (u.isLeaf)
    return n.replaceWith(e, e + u.nodeSize, s);
  if (!t.validContent(u.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new ee(e, e + u.nodeSize, e + 1, e + u.nodeSize - 1, new w(k.from(s), 0, 0), 1, !0));
}
function cn(n, e, t = 1, r) {
  let i = n.resolve(e), u = i.depth - t, s = r && r[r.length - 1] || i.parent;
  if (u < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !s.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let a = i.depth - 1, c = t - 2; a > u; a--, c--) {
    let f = i.node(a), h = i.index(a);
    if (f.type.spec.isolating)
      return !1;
    let p = f.content.cutByIndex(h, f.childCount), d = r && r[c + 1];
    d && (p = p.replaceChild(0, d.type.create(d.attrs)));
    let m = r && r[c] || f;
    if (!f.canReplace(h + 1, f.childCount) || !m.type.validContent(p))
      return !1;
  }
  let o = i.indexAfter(u), l = r && r[0];
  return i.node(u).canReplaceWith(o, o, l ? l.type : i.node(u + 1).type);
}
function jc(n, e, t = 1, r) {
  let i = n.doc.resolve(e), u = k.empty, s = k.empty;
  for (let o = i.depth, l = i.depth - t, a = t - 1; o > l; o--, a--) {
    u = k.from(i.node(o).copy(u));
    let c = r && r[a];
    s = k.from(c ? c.type.create(c.attrs, s) : i.node(o).copy(s));
  }
  n.step(new W(e, e, new w(u.append(s), t, t), !0));
}
function Rr(n, e) {
  let t = n.resolve(e), r = t.index();
  return Kc(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Jc(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let u = e.child(i), s = u.type == r ? n.type.schema.nodes.text : u.type;
    if (t = t.matchType(s), !t || !n.type.allowsMarks(u.marks))
      return !1;
  }
  return t.validEnd;
}
function Kc(n, e) {
  return !!(n && e && !n.isLeaf && Jc(n, e));
}
function Zc(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, u = n.doc.resolve(e - t), s = u.node().type;
  if (i && s.inlineContent) {
    let c = s.whitespace == "pre", f = !!s.contentMatch.matchType(i);
    c && !f ? r = !1 : !c && f && (r = !0);
  }
  let o = n.steps.length;
  if (r === !1) {
    let c = n.doc.resolve(e + t);
    Uo(n, c.node(), c.before(), o);
  }
  s.inlineContent && ru(n, e + t - 1, s, u.node().contentMatchAt(u.index()), r == null);
  let l = n.mapping.slice(o), a = l.map(e - t);
  if (n.step(new W(a, l.map(e + t, -1), w.empty, !0)), r === !0) {
    let c = n.doc.resolve(a);
    Ho(n, c.node(), c.before(), n.steps.length);
  }
  return n;
}
function Gc(n, e, t) {
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
function Yc(n, e, t) {
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
function iu(n, e, t = e, r = w.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), u = n.resolve(t);
  return Wo(i, u, r) ? new W(e, t, r) : new Xc(i, u, r).fit();
}
function Wo(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Xc {
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
    let l = new w(u, s, o);
    return e > -1 ? new ee(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new W(r.pos, i.pos, l) : null;
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
        r ? (u = Xr(this.unplaced.content, r - 1).firstChild, i = u.content) : i = this.unplaced.content;
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
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Xr(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new w(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Xr(e, t);
    if (i.childCount <= 1 && t > 0) {
      let u = e.size - t <= t + i.size;
      this.unplaced = new w(en(e, t - 1, 1), t - 1, u ? t - 1 : r);
    } else
      this.unplaced = new w(en(e, t, 1), t, r);
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
    let s = this.unplaced, o = r ? r.content : s.content, l = s.openStart - e, a = 0, c = [], { match: f, type: h } = this.frontier[t];
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
      a++, (a > 1 || l == 0 || m.content.size) && (f = g, c.push(jo(m.mark(h.allowedMarks(m.marks)), a == 1 ? l : 0, a == o.childCount ? p : -1)));
    }
    let d = a == o.childCount;
    d || (p = -1), this.placed = tn(this.placed, t, k.from(c)), this.frontier[t].match = f, d && p < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = o; m < p; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = d ? e == 0 ? w.empty : new w(en(s.content, e - 1, 1), e - 1, p < 0 ? s.openEnd : e - 1) : new w(en(s.content, e, a), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Qr(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], u = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), s = Qr(e, t, i, r, u);
      if (s) {
        for (let o = t - 1; o >= 0; o--) {
          let { match: l, type: a } = this.frontier[o], c = Qr(e, o, a, l, !0);
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
    t.fit.childCount && (this.placed = tn(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), u = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, u);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = tn(this.placed, this.depth, k.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(k.empty, !0);
    t.childCount && (this.placed = tn(this.placed, this.frontier.length, t));
  }
}
function en(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(en(n.firstChild.content, e - 1, t)));
}
function tn(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(tn(n.lastChild.content, e - 1, t)));
}
function Xr(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function jo(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, jo(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(k.empty, !0)))), n.copy(r);
}
function Qr(n, e, t, r, i) {
  let u = n.node(e), s = i ? n.indexAfter(e) : n.index(e);
  if (s == u.childCount && !t.compatibleContent(u.type))
    return null;
  let o = r.fillBefore(u.content, !0, s);
  return o && !Qc(t, u.content, s) ? o : null;
}
function Qc(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function ef(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function tf(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), u = n.doc.resolve(t);
  if (Wo(i, u, r))
    return n.step(new W(e, t, r));
  let s = Ko(i, u);
  s[s.length - 1] == 0 && s.pop();
  let o = -(i.depth + 1);
  s.unshift(o);
  for (let h = i.depth, p = i.pos - 1; h > 0; h--, p--) {
    let d = i.node(h).type.spec;
    if (d.defining || d.definingAsContext || d.isolating)
      break;
    s.indexOf(h) > -1 ? o = h : i.before(h) == p && s.splice(1, 0, -h);
  }
  let l = s.indexOf(o), a = [], c = r.openStart;
  for (let h = r.content, p = 0; ; p++) {
    let d = h.firstChild;
    if (a.push(d), p == r.openStart)
      break;
    h = d.content;
  }
  for (let h = c - 1; h >= 0; h--) {
    let p = a[h], d = ef(p.type);
    if (d && !p.sameMarkup(i.node(Math.abs(o) - 1)))
      c = h;
    else if (d || !p.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let p = (h + c + 1) % (r.openStart + 1), d = a[p];
    if (d)
      for (let m = 0; m < s.length; m++) {
        let g = s[(m + l) % s.length], y = !0;
        g < 0 && (y = !1, g = -g);
        let E = i.node(g - 1), D = i.index(g - 1);
        if (E.canReplaceWith(D, D, d.type, d.marks))
          return n.replace(i.before(g), y ? u.after(g) : t, new w(Jo(r.content, 0, r.openStart, p), p, r.openEnd));
      }
  }
  let f = n.steps.length;
  for (let h = s.length - 1; h >= 0 && (n.replace(e, t, r), !(n.steps.length > f)); h--) {
    let p = s[h];
    p < 0 || (e = i.before(p), t = u.after(p));
  }
}
function Jo(n, e, t, r, i) {
  if (e < t) {
    let u = n.firstChild;
    n = n.replaceChild(0, u.copy(Jo(u.content, e + 1, t, r, u)));
  }
  if (e > r) {
    let u = i.contentMatchAt(0), s = u.fillBefore(n).append(n);
    n = s.append(u.matchFragment(s).fillBefore(k.empty, !0));
  }
  return n;
}
function nf(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = Gc(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new w(k.from(r), 0, 0));
}
function rf(n, e, t) {
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
  let u = Ko(r, i);
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
function Ko(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let u = n.start(i);
    if (u < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (u == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == u - 1) && t.push(i);
  }
  return t;
}
class Pt extends ne {
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
    return q.fromReplace(e, this.pos, this.pos + 1, new w(k.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return oe.empty;
  }
  invert(e) {
    return new Pt(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Pt(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Pt(t.pos, t.attr, t.value);
  }
}
ne.jsonID("attr", Pt);
class En extends ne {
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
    return oe.empty;
  }
  invert(e) {
    return new En(this.attr, e.attrs[this.attr]);
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
    return new En(t.attr, t.value);
  }
}
ne.jsonID("docAttr", En);
let Ht = class extends Error {
};
Ht = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
Ht.prototype = Object.create(Error.prototype);
Ht.prototype.constructor = Ht;
Ht.prototype.name = "TransformError";
class uf {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new Sn();
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
      throw new Ht(t.failed);
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
  replace(e, t = e, r = w.empty) {
    let i = iu(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new w(k.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, w.empty);
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
    return tf(this, e, t, r), this;
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
    return nf(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return rf(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Bc(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Zc(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return qc(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return Hc(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return Wc(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new Pt(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new En(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new Qe(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof R)
      t.isInSet(r.marks) && this.step(new wt(e, t));
    else {
      let i = r.marks, u, s = [];
      for (; u = t.isInSet(i); )
        s.push(new wt(e, u)), i = u.removeFromSet(i);
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
    return jc(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Pc(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return $c(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return ru(this, e, t, r), this;
  }
}
const ei = /* @__PURE__ */ Object.create(null);
class I {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new sf(e.min(t), e.max(t))];
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
  replace(e, t = w.empty) {
    let r = t.content.lastChild, i = null;
    for (let o = 0; o < t.openEnd; o++)
      i = r, r = r.lastChild;
    let u = e.steps.length, s = this.ranges;
    for (let o = 0; o < s.length; o++) {
      let { $from: l, $to: a } = s[o], c = e.mapping.slice(u);
      e.replaceRange(c.map(l.pos), c.map(a.pos), o ? w.empty : t), o == 0 && Qu(e, u, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
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
      u ? e.deleteRange(a, c) : (e.replaceRangeWith(a, c, t), Qu(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new P(e) : Nt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let u = e.depth - 1; u >= 0; u--) {
      let s = t < 0 ? Nt(e.node(0), e.node(u), e.before(u + 1), e.index(u), t, r) : Nt(e.node(0), e.node(u), e.after(u + 1), e.index(u) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new le(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Nt(e, e, 0, 0, 1) || new le(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Nt(e, e, e.content.size, e.childCount, -1) || new le(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = ei[t.type];
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
    if (e in ei)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return ei[e] = t, t.prototype.jsonID = e, t;
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
    return P.between(this.$anchor, this.$head).getBookmark();
  }
}
I.prototype.visible = !0;
class sf {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Yu = !1;
function Xu(n) {
  !Yu && !n.parent.inlineContent && (Yu = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class P extends I {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Xu(e), Xu(t), super(e, t);
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
      return I.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new P(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = w.empty) {
    if (super.replace(e, t), t == w.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof P && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Pr(this.anchor, this.head);
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
    return new P(e.resolve(t.anchor), e.resolve(t.head));
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
      let u = I.findFrom(t, r, !0) || I.findFrom(t, -r, !0);
      if (u)
        t = u.$head;
      else
        return I.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (I.findFrom(e, -r, !0) || I.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new P(e, t);
  }
}
I.jsonID("text", P);
class Pr {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Pr(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return P.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class O extends I {
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
    return r ? I.near(u) : new O(u);
  }
  content() {
    return new w(k.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof O && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new uu(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new O(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new O(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
O.prototype.visible = !1;
I.jsonID("node", O);
class uu {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Pr(r, r) : new uu(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && O.isSelectable(r) ? new O(t) : I.near(t);
  }
}
class le extends I {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = w.empty) {
    if (t == w.empty) {
      e.delete(0, e.doc.content.size);
      let r = I.atStart(e.doc);
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
    return new le(e);
  }
  map(e) {
    return new le(e);
  }
  eq(e) {
    return e instanceof le;
  }
  getBookmark() {
    return of;
  }
}
I.jsonID("all", le);
const of = {
  map() {
    return this;
  },
  resolve(n) {
    return new le(n);
  }
};
function Nt(n, e, t, r, i, u = !1) {
  if (e.inlineContent)
    return P.create(n, t);
  for (let s = r - (i > 0 ? 0 : 1); i > 0 ? s < e.childCount : s >= 0; s += i) {
    let o = e.child(s);
    if (o.isAtom) {
      if (!u && O.isSelectable(o))
        return O.create(n, t - (i < 0 ? o.nodeSize : 0));
    } else {
      let l = Nt(n, o, t + i, i < 0 ? o.childCount : 0, i, u);
      if (l)
        return l;
    }
    t += o.nodeSize * i;
  }
  return null;
}
function Qu(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof W || i instanceof ee))
    return;
  let u = n.mapping.maps[r], s;
  u.forEach((o, l, a, c) => {
    s == null && (s = c);
  }), n.setSelection(I.near(n.doc.resolve(s), t));
}
const es = 1, ir = 2, ts = 4;
class lf extends uf {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | es) & ~ir, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & es) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= ir, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return R.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
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
    return (this.updated & ir) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~ir, this.storedMarks = null;
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
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || R.none))), r.replaceWith(this, e), this;
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
      return this.replaceRangeWith(t, r, i.text(e, u)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(I.near(this.selection.$to)), this;
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
    return this.updated |= ts, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & ts) > 0;
  }
}
function ns(n, e) {
  return !e || !n ? n : n.bind(e);
}
class nn {
  constructor(e, t, r) {
    this.name = e, this.init = ns(t.init, r), this.apply = ns(t.apply, r);
  }
}
const af = [
  new nn("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new nn("selection", {
    init(n, e) {
      return n.selection || I.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new nn("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new nn("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class ti {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = af.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new nn(r.key, r.spec.state, r));
    });
  }
}
class Rt {
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
    let t = new Rt(this.config), r = this.config.fields;
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
    return new lf(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new ti(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Rt(t);
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
    let t = new ti(this.schema, e.plugins), r = t.fields, i = new Rt(t);
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
    let i = new ti(e.schema, e.plugins), u = new Rt(i);
    return i.fields.forEach((s) => {
      if (s.name == "doc")
        u.doc = _e.fromJSON(e.schema, t.doc);
      else if (s.name == "selection")
        u.selection = I.fromJSON(u.doc, t.selection);
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
function Zo(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = Zo(i, e, {})), t[r] = i;
  }
  return t;
}
class $r {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Zo(e.props, this, this.props), this.key = e.key ? e.key.key : Go("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const ni = /* @__PURE__ */ Object.create(null);
function Go(n) {
  return n in ni ? n + "$" + ++ni[n] : (ni[n] = 0, n + "$");
}
class Yo {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Go(e);
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
const Xo = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function cf(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const ff = (n, e, t) => {
  let r = cf(n, t);
  if (!r)
    return !1;
  let i = Qo(r);
  if (!i) {
    let s = r.blockRange(), o = s && Ir(s);
    return o == null ? !1 : (e && e(n.tr.lift(s, o).scrollIntoView()), !0);
  }
  let u = i.nodeBefore;
  if (nl(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (Ut(u, "end") || O.isSelectable(u)))
    for (let s = r.depth; ; s--) {
      let o = iu(n.doc, r.before(s), r.after(s), w.empty);
      if (o && o.slice.size < o.to - o.from) {
        if (e) {
          let l = n.tr.step(o);
          l.setSelection(Ut(u, "end") ? I.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : O.create(l.doc, i.pos - u.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (s == 1 || r.node(s - 1).childCount > 1)
        break;
    }
  return u.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - u.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function Ut(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const df = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, u = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    u = Qo(r);
  }
  let s = u && u.nodeBefore;
  return !s || !O.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(O.create(n.doc, u.pos - s.nodeSize)).scrollIntoView()), !0);
};
function Qo(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function hf(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const pf = (n, e, t) => {
  let r = hf(n, t);
  if (!r)
    return !1;
  let i = el(r);
  if (!i)
    return !1;
  let u = i.nodeAfter;
  if (nl(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (Ut(u, "start") || O.isSelectable(u))) {
    let s = iu(n.doc, r.before(), r.after(), w.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let o = n.tr.step(s);
        o.setSelection(Ut(u, "start") ? I.findFrom(o.doc.resolve(o.mapping.map(i.pos)), 1) : O.create(o.doc, o.mapping.map(i.pos))), e(o.scrollIntoView());
      }
      return !0;
    }
  }
  return u.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + u.nodeSize).scrollIntoView()), !0) : !1;
}, mf = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, u = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    u = el(r);
  }
  let s = u && u.nodeAfter;
  return !s || !O.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(O.create(n.doc, u.pos)).scrollIntoView()), !0);
};
function el(n) {
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
const tl = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function su(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const gf = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), u = t.indexAfter(-1), s = su(i.contentMatchAt(u));
  if (!s || !i.canReplaceWith(u, u, s))
    return !1;
  if (e) {
    let o = t.after(), l = n.tr.replaceWith(o, o, s.createAndFill());
    l.setSelection(I.near(l.doc.resolve(o), 1)), e(l.scrollIntoView());
  }
  return !0;
}, bf = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof le || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let u = su(i.parent.contentMatchAt(i.indexAfter()));
  if (!u || !u.isTextblock)
    return !1;
  if (e) {
    let s = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, o = n.tr.insert(s, u.createAndFill());
    o.setSelection(P.create(o.doc, s + 1)), e(o.scrollIntoView());
  }
  return !0;
}, xf = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let u = t.before();
    if (cn(n.doc, u))
      return e && e(n.tr.split(u).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && Ir(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function yf(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof O && e.selection.node.isBlock)
      return !r.parentOffset || !cn(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let u = [], s, o, l = !1, a = !1;
    for (let p = r.depth; ; p--)
      if (r.node(p).isBlock) {
        l = r.end(p) == r.pos + (r.depth - p), a = r.start(p) == r.pos - (r.depth - p), o = su(r.node(p - 1).contentMatchAt(r.indexAfter(p - 1))), u.unshift(l && o ? { type: o } : null), s = p;
        break;
      } else {
        if (p == 1)
          return !1;
        u.unshift(null);
      }
    let c = e.tr;
    (e.selection instanceof P || e.selection instanceof le) && c.deleteSelection();
    let f = c.mapping.map(r.pos), h = cn(c.doc, f, u.length, u);
    if (h || (u[0] = o ? { type: o } : null, h = cn(c.doc, f, u.length, u)), !h)
      return !1;
    if (c.split(f, u.length, u), !l && a && r.node(s).type != o) {
      let p = c.mapping.map(r.before(s)), d = c.doc.resolve(p);
      o && r.node(s - 1).canReplaceWith(d.index(), d.index() + 1, o) && c.setNodeMarkup(c.mapping.map(r.before(s)), o);
    }
    return t && t(c.scrollIntoView()), !0;
  };
}
const kf = yf(), Cf = (n, e) => (e && e(n.tr.setSelection(new le(n.doc))), !0);
function Sf(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, u = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(u - 1, u) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(u, u + 1) || !(i.isTextblock || Rr(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function nl(n, e, t, r) {
  let i = e.nodeBefore, u = e.nodeAfter, s, o, l = i.type.spec.isolating || u.type.spec.isolating;
  if (!l && Sf(n, e, t))
    return !0;
  let a = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (a && (s = (o = i.contentMatchAt(i.childCount)).findWrapping(u.type)) && o.matchType(s[0] || u.type).validEnd) {
    if (t) {
      let p = e.pos + u.nodeSize, d = k.empty;
      for (let y = s.length - 1; y >= 0; y--)
        d = k.from(s[y].create(null, d));
      d = k.from(i.copy(d));
      let m = n.tr.step(new ee(e.pos - 1, p, e.pos, p, new w(d, 1, 0), s.length, !0)), g = m.doc.resolve(p + 2 * s.length);
      g.nodeAfter && g.nodeAfter.type == i.type && Rr(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let c = u.type.spec.isolating || r > 0 && l ? null : I.findFrom(e, 1), f = c && c.$from.blockRange(c.$to), h = f && Ir(f);
  if (h != null && h >= e.depth)
    return t && t(n.tr.lift(f, h).scrollIntoView()), !0;
  if (a && Ut(u, "start", !0) && Ut(i, "end")) {
    let p = i, d = [];
    for (; d.push(p), !p.isTextblock; )
      p = p.lastChild;
    let m = u, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (p.canReplace(p.childCount, p.childCount, m.content)) {
      if (t) {
        let y = k.empty;
        for (let D = d.length - 1; D >= 0; D--)
          y = k.from(d[D].copy(y));
        let E = n.tr.step(new ee(e.pos - d.length, e.pos + u.nodeSize, e.pos + g, e.pos + u.nodeSize - g, new w(y, d.length, 0), 0, !0));
        t(E.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function rl(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, u = i.depth;
    for (; i.node(u).isInline; ) {
      if (!u)
        return !1;
      u--;
    }
    return i.node(u).isTextblock ? (t && t(e.tr.setSelection(P.create(e.doc, n < 0 ? i.start(u) : i.end(u)))), !0) : !1;
  };
}
const Ef = rl(-1), Df = rl(1);
function wf(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: u } = t.selection, s = i.blockRange(u), o = s && qo(s, n, e);
    return o ? (r && r(t.tr.wrap(s, o).scrollIntoView()), !0) : !1;
  };
}
function rn(n, e = null) {
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
function _f(n, e, t, r) {
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
function ur(n, e = null, t) {
  return function(r, i) {
    let { empty: u, $cursor: s, ranges: o } = r.selection;
    if (u && !s || !_f(r.doc, o, n))
      return !1;
    if (i)
      if (s)
        n.isInSet(r.storedMarks || s.marks()) ? i(r.tr.removeStoredMark(n)) : i(r.tr.addStoredMark(n.create(e)));
      else {
        let l, a = r.tr;
        l = !o.some((c) => r.doc.rangeHasMark(c.$from.pos, c.$to.pos, n));
        for (let c = 0; c < o.length; c++) {
          let { $from: f, $to: h } = o[c];
          if (!l)
            a.removeMark(f.pos, h.pos, n);
          else {
            let p = f.pos, d = h.pos, m = f.nodeAfter, g = h.nodeBefore, y = m && m.isText ? /^\s*/.exec(m.text)[0].length : 0, E = g && g.isText ? /\s*$/.exec(g.text)[0].length : 0;
            p + y < d && (p += y, d -= E), a.addMark(p, d, n.create(e));
          }
        }
        i(a.scrollIntoView());
      }
    return !0;
  };
}
function zr(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
let ri = zr(Xo, ff, df), rs = zr(Xo, pf, mf);
const ve = {
  Enter: zr(tl, bf, xf, kf),
  "Mod-Enter": gf,
  Backspace: ri,
  "Mod-Backspace": ri,
  "Shift-Backspace": ri,
  Delete: rs,
  "Mod-Delete": rs,
  "Mod-a": Cf
}, il = {
  "Ctrl-h": ve.Backspace,
  "Alt-Backspace": ve["Mod-Backspace"],
  "Ctrl-d": ve.Delete,
  "Ctrl-Alt-Backspace": ve["Mod-Delete"],
  "Alt-Delete": ve["Mod-Delete"],
  "Alt-d": ve["Mod-Delete"],
  "Ctrl-a": Ef,
  "Ctrl-e": Df
};
for (let n in ve)
  il[n] = ve[n];
const Af = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform ? os.platform() == "darwin" : !1, Mf = Af ? il : ve;
var Cr = 200, K = function() {
};
K.prototype.append = function(e) {
  return e.length ? (e = K.from(e), !this.length && e || e.length < Cr && this.leafAppend(e) || this.length < Cr && e.leafPrepend(this) || this.appendInner(e)) : this;
};
K.prototype.prepend = function(e) {
  return e.length ? K.from(e).append(this) : this;
};
K.prototype.appendInner = function(e) {
  return new Tf(this, e);
};
K.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? K.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
K.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
K.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
K.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(u, s) {
    return i.push(e(u, s));
  }, t, r), i;
};
K.from = function(e) {
  return e instanceof K ? e : e && e.length ? new ul(e) : K.empty;
};
var ul = /* @__PURE__ */ (function(n) {
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
    if (this.length + i.length <= Cr)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= Cr)
      return new e(i.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
})(K);
K.empty = new ul([]);
var Tf = /* @__PURE__ */ (function(n) {
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
})(K);
const Of = 500;
class be {
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
    return this.items.forEach((f, h) => {
      if (!f.step) {
        i || (i = this.remapping(r, h + 1), u = i.maps.length), u--, c.push(f);
        return;
      }
      if (i) {
        c.push(new Ce(f.map));
        let p = f.step.map(i.slice(u)), d;
        p && s.maybeStep(p).doc && (d = s.mapping.maps[s.mapping.maps.length - 1], a.push(new Ce(d, void 0, void 0, a.length + c.length))), u--, d && i.appendMap(d, u);
      } else
        s.maybeStep(f.step);
      if (f.selection)
        return o = i ? f.selection.map(i.slice(u)) : f.selection, l = new be(this.items.slice(0, r).append(c.reverse().concat(a)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: l, transform: s, selection: o };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, i) {
    let u = [], s = this.eventCount, o = this.items, l = !i && o.length ? o.get(o.length - 1) : null;
    for (let c = 0; c < e.steps.length; c++) {
      let f = e.steps[c].invert(e.docs[c]), h = new Ce(e.mapping.maps[c], f, t), p;
      (p = l && l.merge(h)) && (h = p, c ? u.pop() : o = o.slice(0, o.length - 1)), u.push(h), t && (s++, t = void 0), i || (l = h);
    }
    let a = s - r.depth;
    return a > Ff && (o = Nf(o, a), s -= a), new be(o.append(u), s);
  }
  remapping(e, t) {
    let r = new Sn();
    return this.items.forEach((i, u) => {
      let s = i.mirrorOffset != null && u - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, s);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new be(this.items.append(e.map((t) => new Ce(t))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - t), u = e.mapping, s = e.steps.length, o = this.eventCount;
    this.items.forEach((h) => {
      h.selection && o--;
    }, i);
    let l = t;
    this.items.forEach((h) => {
      let p = u.getMirror(--l);
      if (p == null)
        return;
      s = Math.min(s, p);
      let d = u.maps[p];
      if (h.step) {
        let m = e.steps[p].invert(e.docs[p]), g = h.selection && h.selection.map(u.slice(l + 1, p));
        g && o++, r.push(new Ce(d, m, g));
      } else
        r.push(new Ce(d));
    }, i);
    let a = [];
    for (let h = t; h < s; h++)
      a.push(new Ce(u.maps[h]));
    let c = this.items.slice(0, i).append(a).append(r), f = new be(c, o);
    return f.emptyItemCount() > Of && (f = f.compress(this.items.length - r.length)), f;
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
          let f = new Ce(a.invert(), l, c), h, p = i.length - 1;
          (h = i.length && i[p].merge(f)) ? i[p] = h : i.push(f);
        }
      } else s.map && r--;
    }, this.items.length, 0), new be(K.from(i.reverse()), u);
  }
}
be.empty = new be(K.empty, 0);
function Nf(n, e) {
  let t;
  return n.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return t = i, !1;
  }), n.slice(t);
}
class Ce {
  constructor(e, t, r, i) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new Ce(t.getMap().invert(), t, this.selection);
    }
  }
}
class He {
  constructor(e, t, r, i, u) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = i, this.prevComposition = u;
  }
}
const Ff = 20;
function vf(n, e, t, r) {
  let i = t.getMeta(kt), u;
  if (i)
    return i.historyState;
  t.getMeta(Pf) && (n = new He(n.done, n.undone, null, 0, -1));
  let s = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (s && s.getMeta(kt))
    return s.getMeta(kt).redo ? new He(n.done.addTransform(t, void 0, r, dr(e)), n.undone, is(t.mapping.maps), n.prevTime, n.prevComposition) : new He(n.done, n.undone.addTransform(t, void 0, r, dr(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(s && s.getMeta("addToHistory") === !1)) {
    let o = t.getMeta("composition"), l = n.prevTime == 0 || !s && n.prevComposition != o && (n.prevTime < (t.time || 0) - r.newGroupDelay || !If(t, n.prevRanges)), a = s ? ii(n.prevRanges, t.mapping) : is(t.mapping.maps);
    return new He(n.done.addTransform(t, l ? e.selection.getBookmark() : void 0, r, dr(e)), be.empty, a, t.time, o ?? n.prevComposition);
  } else return (u = t.getMeta("rebased")) ? new He(n.done.rebased(t, u), n.undone.rebased(t, u), ii(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new He(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), ii(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function If(n, e) {
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
function is(n) {
  let e = [];
  for (let t = n.length - 1; t >= 0 && e.length == 0; t--)
    n[t].forEach((r, i, u, s) => e.push(u, s));
  return e;
}
function ii(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1), u = e.map(n[r + 1], -1);
    i <= u && t.push(i, u);
  }
  return t;
}
function Rf(n, e, t) {
  let r = dr(e), i = kt.get(e).spec.config, u = (t ? n.undone : n.done).popEvent(e, r);
  if (!u)
    return null;
  let s = u.selection.resolve(u.transform.doc), o = (t ? n.done : n.undone).addTransform(u.transform, e.selection.getBookmark(), i, r), l = new He(t ? o : u.remaining, t ? u.remaining : o, null, 0, -1);
  return u.transform.setSelection(s).setMeta(kt, { redo: t, historyState: l });
}
let ui = !1, us = null;
function dr(n) {
  let e = n.plugins;
  if (us != e) {
    ui = !1, us = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        ui = !0;
        break;
      }
  }
  return ui;
}
const kt = new Yo("history"), Pf = new Yo("closeHistory");
function $f(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new $r({
    key: kt,
    state: {
      init() {
        return new He(be.empty, be.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return vf(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, i = r == "historyUndo" ? Sr : r == "historyRedo" ? fn : null;
          return !i || !e.editable ? !1 : (t.preventDefault(), i(e.state, e.dispatch));
        }
      }
    }
  });
}
function sl(n, e) {
  return (t, r) => {
    let i = kt.getState(t);
    if (!i || (n ? i.undone : i.done).eventCount == 0)
      return !1;
    if (r) {
      let u = Rf(i, t, n);
      u && r(e ? u.scrollIntoView() : u);
    }
    return !0;
  };
}
const Sr = sl(!1, !0), fn = sl(!0, !0);
var ut = {
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
}, Er = {
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
}, zf = typeof navigator < "u" && /Mac/.test(navigator.platform), Bf = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Y = 0; Y < 10; Y++) ut[48 + Y] = ut[96 + Y] = String(Y);
for (var Y = 1; Y <= 24; Y++) ut[Y + 111] = "F" + Y;
for (var Y = 65; Y <= 90; Y++)
  ut[Y] = String.fromCharCode(Y + 32), Er[Y] = String.fromCharCode(Y);
for (var si in ut) Er.hasOwnProperty(si) || (Er[si] = ut[si]);
function Lf(n) {
  var e = zf && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Bf && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Er : ut)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Vf = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), qf = typeof navigator < "u" && /Win/.test(navigator.platform);
function Hf(n) {
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
      Vf ? s = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), s && (t = "Meta-" + t), u && (t = "Shift-" + t), t;
}
function Uf(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Hf(t)] = n[t];
  return e;
}
function oi(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function Ft(n) {
  return new $r({ props: { handleKeyDown: Wf(n) } });
}
function Wf(n) {
  let e = Uf(n);
  return function(t, r) {
    let i = Lf(r), u, s = e[oi(i, r)];
    if (s && s(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let o = e[oi(i, r, !1)];
        if (o && o(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(qf && r.ctrlKey && r.altKey) && (u = ut[r.keyCode]) && u != i) {
        let o = e[oi(u, r)];
        if (o && o(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
function jf(n, e) {
  return function(t, r) {
    let { $from: i, $to: u, node: s } = t.selection;
    if (s && s.isBlock || i.depth < 2 || !i.sameParent(u))
      return !1;
    let o = i.node(-1);
    if (o.type != n)
      return !1;
    if (i.parent.content.size == 0 && i.node(-1).childCount == i.indexAfter(-1)) {
      if (i.depth == 3 || i.node(-3).type != n || i.index(-2) != i.node(-2).childCount - 1)
        return !1;
      if (r) {
        let f = k.empty, h = i.index(-1) ? 1 : i.index(-2) ? 2 : 3;
        for (let y = i.depth - h; y >= i.depth - 3; y--)
          f = k.from(i.node(y).copy(f));
        let p = i.indexAfter(-1) < i.node(-2).childCount ? 1 : i.indexAfter(-2) < i.node(-3).childCount ? 2 : 3;
        f = f.append(k.from(n.createAndFill()));
        let d = i.before(i.depth - (h - 1)), m = t.tr.replace(d, i.after(-p), new w(f, 4 - h, 0)), g = -1;
        m.doc.nodesBetween(d, m.doc.content.size, (y, E) => {
          if (g > -1)
            return !1;
          y.isTextblock && y.content.size == 0 && (g = E + 1);
        }), g > -1 && m.setSelection(I.near(m.doc.resolve(g))), r(m.scrollIntoView());
      }
      return !0;
    }
    let l = u.pos == i.end() ? o.contentMatchAt(0).defaultType : null, a = t.tr.delete(i.pos, u.pos), c = l ? [null, { type: l }] : void 0;
    return cn(a.doc, i.pos, 2, c) ? (r && r(a.split(i.pos, 2, c).scrollIntoView()), !0) : !1;
  };
}
function Jf(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, u = r.blockRange(i, (s) => s.childCount > 0 && s.firstChild.type == n);
    return u ? t ? r.node(u.depth - 1).type == n ? Kf(e, t, n, u) : Zf(e, t, u) : !0 : !1;
  };
}
function Kf(n, e, t, r) {
  let i = n.tr, u = r.end, s = r.$to.end(r.depth);
  u < s && (i.step(new ee(u - 1, s, u, s, new w(k.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new wo(i.doc.resolve(r.$from.pos), i.doc.resolve(s), r.depth));
  const o = Ir(r);
  if (o == null)
    return !1;
  i.lift(r, o);
  let l = i.doc.resolve(i.mapping.map(u, -1) - 1);
  return Rr(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function Zf(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let p = t.end, d = t.endIndex - 1, m = t.startIndex; d > m; d--)
    p -= i.child(d).nodeSize, r.delete(p - 1, p + 1);
  let u = r.doc.resolve(t.start), s = u.nodeAfter;
  if (r.mapping.map(t.end) != t.start + u.nodeAfter.nodeSize)
    return !1;
  let o = t.startIndex == 0, l = t.endIndex == i.childCount, a = u.node(-1), c = u.index(-1);
  if (!a.canReplace(c + (o ? 0 : 1), c + 1, s.content.append(l ? k.empty : k.from(i))))
    return !1;
  let f = u.pos, h = f + s.nodeSize;
  return r.step(new ee(f - (o ? 1 : 0), h + (l ? 1 : 0), f + 1, h - 1, new w((o ? k.empty : k.from(i.copy(k.empty))).append(l ? k.empty : k.from(i.copy(k.empty))), o ? 0 : 1, l ? 0 : 1), o ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function Gf(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, u = r.blockRange(i, (a) => a.childCount > 0 && a.firstChild.type == n);
    if (!u)
      return !1;
    let s = u.startIndex;
    if (s == 0)
      return !1;
    let o = u.parent, l = o.child(s - 1);
    if (l.type != n)
      return !1;
    if (t) {
      let a = l.lastChild && l.lastChild.type == o.type, c = k.from(a ? n.create() : null), f = new w(k.from(n.create(null, k.from(o.type.create(null, c)))), a ? 3 : 1, 0), h = u.start, p = u.end;
      t(e.tr.step(new ee(h - (a ? 3 : 1), p, h, p, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const X = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, Wt = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Mi = null;
const Fe = function(n, e, t) {
  let r = Mi || (Mi = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, Yf = function() {
  Mi = null;
}, _t = function(n, e, t, r) {
  return t && (ss(n, e, t, r, -1) || ss(n, e, t, r, 1));
}, Xf = /^(img|br|input|textarea|hr)$/i;
function ss(n, e, t, r, i) {
  for (var u; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : de(n))) {
      let s = n.parentNode;
      if (!s || s.nodeType != 1 || Jn(n) || Xf.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = X(n) + (i < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      let s = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (s.nodeType == 1 && s.contentEditable == "false")
        if (!((u = s.pmViewDesc) === null || u === void 0) && u.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = s, e = i < 0 ? de(n) : 0;
    } else
      return !1;
  }
}
function de(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Qf(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = de(n);
    } else if (n.parentNode && !Jn(n))
      e = X(n), n = n.parentNode;
    else
      return null;
  }
}
function ed(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !Jn(n))
      e = X(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function td(n, e, t) {
  for (let r = e == 0, i = e == de(n); r || i; ) {
    if (n == t)
      return !0;
    let u = X(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && u == 0, i = i && u == de(n);
  }
}
function Jn(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Br = function(n) {
  return n.focusNode && _t(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function dt(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function nd(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function rd(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(de(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(de(r.startContainer), r.startOffset) };
  }
}
const Ae = typeof navigator < "u" ? navigator : null, ls = typeof document < "u" ? document : null, ot = Ae && Ae.userAgent || "", Ti = /Edge\/(\d+)/.exec(ot), ol = /MSIE \d/.exec(ot), Oi = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ot), ue = !!(ol || Oi || Ti), tt = ol ? document.documentMode : Oi ? +Oi[1] : Ti ? +Ti[1] : 0, pe = !ue && /gecko\/(\d+)/i.test(ot);
pe && +(/Firefox\/(\d+)/.exec(ot) || [0, 0])[1];
const Ni = !ue && /Chrome\/(\d+)/.exec(ot), J = !!Ni, ll = Ni ? +Ni[1] : 0, te = !ue && !!Ae && /Apple Computer/.test(Ae.vendor), jt = te && (/Mobile\/\w+/.test(ot) || !!Ae && Ae.maxTouchPoints > 2), fe = jt || (Ae ? /Mac/.test(Ae.platform) : !1), al = Ae ? /Win/.test(Ae.platform) : !1, $e = /Android \d/.test(ot), Kn = !!ls && "webkitFontSmoothing" in ls.documentElement.style, id = Kn ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function ud(n) {
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
function Ne(n, e) {
  return typeof n == "number" ? n : n[e];
}
function sd(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function as(n, e, t) {
  if (!Fi(e) && e.left == 0)
    return;
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, u = n.dom.ownerDocument;
  for (let s = t || n.dom; s; ) {
    if (s.nodeType != 1) {
      s = Wt(s);
      continue;
    }
    let o = s, l = o == u.body, a = l ? ud(u) : sd(o), c = 0, f = 0;
    if (e.top < a.top + Ne(r, "top") ? f = -(a.top - e.top + Ne(i, "top")) : e.bottom > a.bottom - Ne(r, "bottom") && (f = e.bottom - e.top > a.bottom - a.top ? e.top + Ne(i, "top") - a.top : e.bottom - a.bottom + Ne(i, "bottom")), e.left < a.left + Ne(r, "left") ? c = -(a.left - e.left + Ne(i, "left")) : e.right > a.right - Ne(r, "right") && (c = e.right - a.right + Ne(i, "right")), c || f)
      if (l)
        u.defaultView.scrollBy(c, f);
      else {
        let p = o.scrollLeft, d = o.scrollTop;
        f && (o.scrollTop += f), c && (o.scrollLeft += c);
        let m = o.scrollLeft - p, g = o.scrollTop - d;
        e = { left: e.left - m, top: e.top - g, right: e.right - m, bottom: e.bottom - g };
      }
    let h = l ? "fixed" : getComputedStyle(s).position;
    if (/^(fixed|sticky)$/.test(h))
      break;
    s = h == "absolute" ? s.offsetParent : Wt(s);
  }
}
function od(n) {
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
  return { refDOM: r, refTop: i, stack: cl(n.dom) };
}
function cl(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Wt(r))
    ;
  return e;
}
function ld({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  fl(t, r == 0 ? 0 : r - e);
}
function fl(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: u } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != u && (r.scrollLeft = u);
  }
}
let Mt = null;
function ad(n) {
  if (n.setActive)
    return n.setActive();
  if (Mt)
    return n.focus(Mt);
  let e = cl(n);
  n.focus(Mt == null ? {
    get preventScroll() {
      return Mt = { preventScroll: !0 }, !0;
    }
  } : void 0), Mt || (Mt = !1, fl(e, 0));
}
function dl(n, e) {
  let t, r = 2e8, i, u = 0, s = e.top, o = e.top, l, a;
  for (let c = n.firstChild, f = 0; c; c = c.nextSibling, f++) {
    let h;
    if (c.nodeType == 1)
      h = c.getClientRects();
    else if (c.nodeType == 3)
      h = Fe(c).getClientRects();
    else
      continue;
    for (let p = 0; p < h.length; p++) {
      let d = h[p];
      if (d.top <= s && d.bottom >= o) {
        s = Math.max(d.bottom, s), o = Math.min(d.top, o);
        let m = d.left > e.left ? d.left - e.left : d.right < e.left ? e.left - d.right : 0;
        if (m < r) {
          t = c, r = m, i = m && t.nodeType == 3 ? {
            left: d.right < e.left ? d.right : d.left,
            top: e.top
          } : e, c.nodeType == 1 && m && (u = f + (e.left >= (d.left + d.right) / 2 ? 1 : 0));
          continue;
        }
      } else d.top > e.top && !l && d.left <= e.left && d.right >= e.left && (l = c, a = { left: Math.max(d.left, Math.min(d.right, e.left)), top: d.top });
      !t && (e.left >= d.right && e.top >= d.top || e.left >= d.left && e.top >= d.bottom) && (u = f + 1);
    }
  }
  return !t && l && (t = l, i = a, r = 0), t && t.nodeType == 3 ? cd(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: u } : dl(t, i);
}
function cd(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let u = 0; u < t; u++) {
    r.setEnd(n, u + 1), r.setStart(n, u);
    let s = qe(r, 1);
    if (s.top != s.bottom && ou(e, s)) {
      i = { node: n, offset: u + (e.left >= (s.left + s.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function ou(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function fd(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function dd(n, e, t) {
  let { node: r, offset: i } = dl(e, t), u = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let s = r.getBoundingClientRect();
    u = s.left != s.right && t.left > (s.left + s.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, u);
}
function hd(n, e, t, r) {
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
function hl(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), u = i; ; ) {
      let s = n.childNodes[u];
      if (s.nodeType == 1) {
        let o = s.getClientRects();
        for (let l = 0; l < o.length; l++) {
          let a = o[l];
          if (ou(e, a))
            return hl(s, e, a);
        }
      }
      if ((u = (u + 1) % r) == i)
        break;
    }
  return n;
}
function pd(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, u = rd(t, e.left, e.top);
  u && ({ node: r, offset: i } = u);
  let s = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), o;
  if (!s || !n.dom.contains(s.nodeType != 1 ? s.parentNode : s)) {
    let a = n.dom.getBoundingClientRect();
    if (!ou(e, a) || (s = hl(n.dom, e, a), !s))
      return null;
  }
  if (te)
    for (let a = s; r && a; a = Wt(a))
      a.draggable && (r = void 0);
  if (s = fd(s, e), r) {
    if (pe && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let c = r.childNodes[i], f;
      c.nodeName == "IMG" && (f = c.getBoundingClientRect()).right <= e.left && f.bottom > e.top && i++;
    }
    let a;
    Kn && i && r.nodeType == 1 && (a = r.childNodes[i - 1]).nodeType == 1 && a.contentEditable == "false" && a.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? o = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (o = hd(n, r, i, e));
  }
  o == null && (o = dd(n, s, e));
  let l = n.docView.nearestDesc(s, !0);
  return { pos: o, inside: l ? l.posAtStart - l.border : -1 };
}
function Fi(n) {
  return n.top < n.bottom || n.left < n.right;
}
function qe(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (Fi(r))
      return r;
  }
  return Array.prototype.find.call(t, Fi) || n.getBoundingClientRect();
}
const md = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function pl(n, e, t) {
  let { node: r, offset: i, atom: u } = n.docView.domFromPos(e, t < 0 ? -1 : 1), s = Kn || pe;
  if (r.nodeType == 3)
    if (s && (md.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = qe(Fe(r, i, i), t);
      if (pe && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let a = qe(Fe(r, i - 1, i - 1), -1);
        if (a.top == l.top) {
          let c = qe(Fe(r, i, i + 1), -1);
          if (c.top != l.top)
            return Xt(c, c.left < a.left);
        }
      }
      return l;
    } else {
      let l = i, a = i, c = t < 0 ? 1 : -1;
      return t < 0 && !i ? (a++, c = -1) : t >= 0 && i == r.nodeValue.length ? (l--, c = 1) : t < 0 ? l-- : a++, Xt(qe(Fe(r, l, a), c), c < 0);
    }
  if (!n.state.doc.resolve(e - (u || 0)).parent.inlineContent) {
    if (u == null && i && (t < 0 || i == de(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return li(l.getBoundingClientRect(), !1);
    }
    if (u == null && i < de(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return li(l.getBoundingClientRect(), !0);
    }
    return li(r.getBoundingClientRect(), t >= 0);
  }
  if (u == null && i && (t < 0 || i == de(r))) {
    let l = r.childNodes[i - 1], a = l.nodeType == 3 ? Fe(l, de(l) - (s ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (a)
      return Xt(qe(a, 1), !1);
  }
  if (u == null && i < de(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let a = l ? l.nodeType == 3 ? Fe(l, 0, s ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (a)
      return Xt(qe(a, -1), !0);
  }
  return Xt(qe(r.nodeType == 3 ? Fe(r) : r, -t), t >= 0);
}
function Xt(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function li(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function ml(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function gd(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return ml(n, e, () => {
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
    let s = pl(n, i.pos, 1);
    for (let o = u.firstChild; o; o = o.nextSibling) {
      let l;
      if (o.nodeType == 1)
        l = o.getClientRects();
      else if (o.nodeType == 3)
        l = Fe(o, 0, o.nodeValue.length).getClientRects();
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
const bd = /[\u0590-\u08ac]/;
function xd(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, u = !i, s = i == r.parent.content.size, o = n.domSelection();
  return o ? !bd.test(r.parent.textContent) || !o.modify ? t == "left" || t == "backward" ? u : s : ml(n, e, () => {
    let { focusNode: l, focusOffset: a, anchorNode: c, anchorOffset: f } = n.domSelectionRange(), h = o.caretBidiLevel;
    o.modify("move", t, "character");
    let p = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: d, focusOffset: m } = n.domSelectionRange(), g = d && !p.contains(d.nodeType == 1 ? d : d.parentNode) || l == d && a == m;
    try {
      o.collapse(c, f), l && (l != c || a != f) && o.extend && o.extend(l, a);
    } catch {
    }
    return h != null && (o.caretBidiLevel = h), g;
  }) : r.pos == r.start() || r.pos == r.end();
}
let cs = null, fs = null, ds = !1;
function yd(n, e, t) {
  return cs == e && fs == t ? ds : (cs = e, fs = t, ds = t == "up" || t == "down" ? gd(n, e, t) : xd(n, e, t));
}
const me = 0, hs = 1, pt = 2, xe = 3;
class Zn {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = me, r.pmViewDesc = this;
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
      i = t > X(this.contentDOM);
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
      if (o > e || s instanceof bl) {
        i = e - u;
        break;
      }
      u = o;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let u; r && !(u = this.children[r - 1]).size && u instanceof gl && u.side >= 0; r--)
      ;
    if (t <= 0) {
      let u, s = !0;
      for (; u = r ? this.children[r - 1] : null, !(!u || u.dom.parentNode == this.contentDOM); r--, s = !1)
        ;
      return u && t && s && !u.border && !u.domAtom ? u.domFromPos(u.size, t) : { node: this.contentDOM, offset: u ? X(u.dom) + 1 : 0 };
    } else {
      let u, s = !0;
      for (; u = r < this.children.length ? this.children[r] : null, !(!u || u.dom.parentNode == this.contentDOM); r++, s = !1)
        ;
      return u && s && !u.border && !u.domAtom ? u.domFromPos(0, t) : { node: this.contentDOM, offset: u ? X(u.dom) : this.contentDOM.childNodes.length };
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
          let h = this.children[f - 1];
          if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
            i = X(h.dom) + 1;
            break;
          }
          e -= h.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (a > t || o == this.children.length - 1)) {
        t = a;
        for (let c = o + 1; c < this.children.length; c++) {
          let f = this.children[c];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(-1)) {
            u = X(f.dom);
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
    for (let p = 0, d = 0; p < this.children.length; p++) {
      let m = this.children[p], g = d + m.size;
      if (u > d && s < g)
        return m.setSelection(e - d - m.border, t - d - m.border, r, i);
      d = g;
    }
    let o = this.domFromPos(e, e ? -1 : 1), l = t == e ? o : this.domFromPos(t, t ? -1 : 1), a = r.root.getSelection(), c = r.domSelectionRange(), f = !1;
    if ((pe || te) && e == t) {
      let { node: p, offset: d } = o;
      if (p.nodeType == 3) {
        if (f = !!(d && p.nodeValue[d - 1] == `
`), f && d == p.nodeValue.length)
          for (let m = p, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (o = l = { node: g.parentNode, offset: X(g) + 1 });
              break;
            }
            let y = m.pmViewDesc;
            if (y && y.node && y.node.isBlock)
              break;
          }
      } else {
        let m = p.childNodes[d - 1];
        f = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (pe && c.focusNode && c.focusNode != l.node && c.focusNode.nodeType == 1) {
      let p = c.focusNode.childNodes[c.focusOffset];
      p && p.contentEditable == "false" && (i = !0);
    }
    if (!(i || f && te) && _t(o.node, o.offset, c.anchorNode, c.anchorOffset) && _t(l.node, l.offset, c.focusNode, c.focusOffset))
      return;
    let h = !1;
    if ((a.extend || e == t) && !(f && pe)) {
      a.collapse(o.node, o.offset);
      try {
        e != t && a.extend(l.node, l.offset), h = !0;
      } catch {
      }
    }
    if (!h) {
      if (e > t) {
        let d = o;
        o = l, l = d;
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
          this.dirty = e == r || t == s ? pt : hs, e == o && t == l && (u.contentLost || u.dom.parentNode != this.contentDOM) ? u.dirty = xe : u.markDirty(e - o, t - o);
          return;
        } else
          u.dirty = u.dom == u.contentDOM && u.dom.parentNode == this.contentDOM && !u.children.length ? pt : xe;
      }
      r = s;
    }
    this.dirty = pt;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? pt : hs;
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
class gl extends Zn {
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
    return this.dirty == me && e.type.eq(this.widget.type);
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
class kd extends Zn {
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
class nt extends Zn {
  constructor(e, t, r, i, u) {
    super(e, [], r, i), this.mark = t, this.spec = u;
  }
  static create(e, t, r, i) {
    let u = i.nodeViews[t.type.name], s = u && u(t, i, r);
    return (!s || !s.dom) && (s = Zt.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new nt(e, t, s.dom, s.contentDOM || s.dom, s);
  }
  parseRule() {
    return this.dirty & xe || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != xe && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != me) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = me;
    }
  }
  slice(e, t, r) {
    let i = nt.create(this.parent, this.mark, !0, r), u = this.children, s = this.size;
    t < s && (u = Ii(u, t, s, r)), e > 0 && (u = Ii(u, 0, e, r));
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
class rt extends Zn {
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
    } else c || ({ dom: c, contentDOM: f } = Zt.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !f && !t.isText && c.nodeName != "BR" && (c.hasAttribute("contenteditable") || (c.contentEditable = "false"), t.type.spec.draggable && (c.draggable = !0));
    let h = c;
    return c = kl(c, r, t), a ? l = new Cd(e, t, r, i, c, f || null, h, a) : t.isText ? new Lr(e, t, r, i, c, h) : new rt(e, t, r, i, c, f || null, h);
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
    return this.dirty == me && e.eq(this.node) && Dr(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, u = e.composing ? this.localCompositionInfo(e, t) : null, s = u && u.pos > -1 ? u : null, o = u && u.pos < 0, l = new Ed(this, s && s.node, e);
    _d(this.node, this.innerDeco, (a, c, f) => {
      a.spec.marks ? l.syncToMarks(a.spec.marks, r, e, c) : a.type.side >= 0 && !f && l.syncToMarks(c == this.node.childCount ? R.none : this.node.child(c).marks, r, e, c), l.placeWidget(a, e, i);
    }, (a, c, f, h) => {
      l.syncToMarks(a.marks, r, e, h);
      let p;
      l.findNodeMatch(a, c, f, h) || o && e.state.selection.from > i && e.state.selection.to < i + a.nodeSize && (p = l.findIndexWithChild(u.node)) > -1 && l.updateNodeAt(a, c, f, p, e) || l.updateNextNode(a, c, f, e, h, i) || l.addNode(a, c, f, e, i), i += a.nodeSize;
    }), l.syncToMarks([], r, e, 0), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == pt) && (s && this.protectLocalComposition(e, s), xl(this.contentDOM, this.children, e), jt && Ad(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof P) || r < t || i > t + this.node.content.size)
      return null;
    let u = e.input.compositionNode;
    if (!u || !this.dom.contains(u.parentNode))
      return null;
    if (this.node.inlineContent) {
      let s = u.nodeValue, o = Md(this.node.content, s, r - t, i - t);
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
    let s = new kd(this, u, t, i);
    e.input.compositionNodes.push(s), this.children = Ii(this.children, r, r + i.length, e, s);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == xe || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = me;
  }
  updateOuterDeco(e) {
    if (Dr(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = yl(this.dom, this.nodeDOM, vi(this.outerDeco, this.node, t), vi(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function ps(n, e, t, r, i) {
  kl(r, e, n);
  let u = new rt(void 0, n, e, t, r, r, r);
  return u.contentDOM && u.updateChildren(i, 0), u;
}
class Lr extends rt {
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
    return this.dirty == xe || this.dirty != me && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != me || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = me, !0);
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
    return new Lr(this.parent, i, this.outerDeco, this.innerDeco, u, u);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = xe);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class bl extends Zn {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == me && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Cd extends rt {
  constructor(e, t, r, i, u, s, o, l) {
    super(e, t, r, i, u, s, o), this.spec = l;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == xe)
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
function xl(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let u = 0; u < e.length; u++) {
    let s = e[u], o = s.dom;
    if (o.parentNode == n) {
      for (; o != r; )
        r = ms(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(o, r);
    if (s instanceof nt) {
      let l = r ? r.previousSibling : n.lastChild;
      xl(s.contentDOM, s.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = ms(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const dn = function(n) {
  n && (this.nodeName = n);
};
dn.prototype = /* @__PURE__ */ Object.create(null);
const mt = [new dn()];
function vi(n, e, t) {
  if (n.length == 0)
    return mt;
  let r = t ? mt[0] : new dn(), i = [r];
  for (let u = 0; u < n.length; u++) {
    let s = n[u].type.attrs;
    if (s) {
      s.nodeName && i.push(r = new dn(s.nodeName));
      for (let o in s) {
        let l = s[o];
        l != null && (t && i.length == 1 && i.push(r = new dn(e.isInline ? "span" : "div")), o == "class" ? r.class = (r.class ? r.class + " " : "") + l : o == "style" ? r.style = (r.style ? r.style + ";" : "") + l : o != "nodeName" && (r[o] = l));
      }
    }
  }
  return i;
}
function yl(n, e, t, r) {
  if (t == mt && r == mt)
    return e;
  let i = e;
  for (let u = 0; u < r.length; u++) {
    let s = r[u], o = t[u];
    if (u) {
      let l;
      o && o.nodeName == s.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == s.nodeName || (l = document.createElement(s.nodeName), l.pmIsDeco = !0, l.appendChild(i), o = mt[0]), i = l;
    }
    Sd(i, o || mt[0], s);
  }
  return i;
}
function Sd(n, e, t) {
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
function kl(n, e, t) {
  return yl(n, n, mt, vi(e, t, n.nodeType != 1));
}
function Dr(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function ms(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Ed {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Dd(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = me, this.index = this.stack.pop(), this.top = this.stack.pop(), s--;
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
        c instanceof nt && c.dirty != xe && c.mark.type == e[s].type && c.spec.update && !this.isLocked(c.dom) && c.spec.update(e[s]) && (c.mark = e[s], l = this.index, this.changed = !0);
      }
      if (l > -1)
        l > this.index && (this.changed = !0, this.destroyBetween(this.index, l)), this.top = this.top.children[this.index];
      else {
        let c = nt.create(this.top, e[s], t, r);
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
    return s.dirty == xe && s.dom == s.contentDOM && (s.dirty = pt), s.update(e, t, r, u) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
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
      if (l instanceof rt) {
        let a = this.preMatch.matched.get(l);
        if (a != null && a != u)
          return !1;
        let c = l.dom, f, h = this.isLocked(c) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != xe && Dr(t, l.outerDeco));
        if (!h && l.update(e, t, r, i))
          return this.destroyBetween(this.index, o), l.dom != c && (this.changed = !0), this.index++, !0;
        if (!h && (f = this.recreateWrapper(l, e, t, r, i, s)))
          return this.destroyBetween(this.index, o), this.top.children[this.index] = f, f.contentDOM && (f.dirty = pt, f.updateChildren(i, s + 1), f.dirty = me), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, u, s) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !Dr(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let o = rt.create(this.top, t, r, i, u, s);
    if (o.contentDOM) {
      o.children = e.children, e.children = [];
      for (let l of o.children)
        l.parent = o;
    }
    return e.destroy(), o;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, u) {
    let s = rt.create(this.top, e, t, r, i, u);
    s.contentDOM && s.updateChildren(i, u + 1), this.top.children.splice(this.index++, 0, s), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let u = new gl(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, u), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof nt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Lr) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((te || J) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new bl(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function Dd(n, e) {
  let t = e, r = t.children.length, i = n.childCount, u = /* @__PURE__ */ new Map(), s = [];
  e: for (; i > 0; ) {
    let o;
    for (; ; )
      if (r) {
        let a = t.children[r - 1];
        if (a instanceof nt)
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
function wd(n, e) {
  return n.type.side - e.type.side;
}
function _d(n, e, t, r) {
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
        f.sort(wd);
        for (let g = 0; g < f.length; g++)
          t(f[g], a, !!l);
      } else
        t(c, a, !!l);
    let h, p;
    if (l)
      p = -1, h = l, l = null;
    else if (a < n.childCount)
      p = a, h = n.child(a++);
    else
      break;
    for (let g = 0; g < o.length; g++)
      o[g].to <= u && o.splice(g--, 1);
    for (; s < i.length && i[s].from <= u && i[s].to > u; )
      o.push(i[s++]);
    let d = u + h.nodeSize;
    if (h.isText) {
      let g = d;
      s < i.length && i[s].from < g && (g = i[s].from);
      for (let y = 0; y < o.length; y++)
        o[y].to < g && (g = o[y].to);
      g < d && (l = h.cut(g - u), h = h.cut(0, g - u), d = g, p = -1);
    } else
      for (; s < i.length && i[s].to < d; )
        s++;
    let m = h.isInline && !h.isLeaf ? o.filter((g) => !g.inline) : o.slice();
    r(h, m, e.forChild(u, h), p), u = d;
  }
}
function Ad(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Md(n, e, t, r) {
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
function Ii(n, e, t, r, i) {
  let u = [];
  for (let s = 0, o = 0; s < n.length; s++) {
    let l = n[s], a = o, c = o += l.size;
    a >= t || c <= e ? u.push(l) : (a < e && u.push(l.slice(0, e - a, r)), i && (u.push(i), i = void 0), c > t && u.push(l.slice(t - a, l.size, r)));
  }
  return u;
}
function lu(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), u = i && i.size == 0, s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0)
    return null;
  let o = r.resolve(s), l, a;
  if (Br(t)) {
    for (l = s; i && !i.node; )
      i = i.parent;
    let f = i.node;
    if (i && f.isAtom && O.isSelectable(f) && i.parent && !(f.isInline && td(t.focusNode, t.focusOffset, i.dom))) {
      let h = i.posBefore;
      a = new O(s == h ? o : r.resolve(h));
    }
  } else {
    if (t instanceof n.dom.ownerDocument.defaultView.Selection && t.rangeCount > 1) {
      let f = s, h = s;
      for (let p = 0; p < t.rangeCount; p++) {
        let d = t.getRangeAt(p);
        f = Math.min(f, n.docView.posFromDOM(d.startContainer, d.startOffset, 1)), h = Math.max(h, n.docView.posFromDOM(d.endContainer, d.endOffset, -1));
      }
      if (f < 0)
        return null;
      [l, s] = h == n.state.selection.anchor ? [h, f] : [f, h], o = r.resolve(s);
    } else
      l = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (l < 0)
      return null;
  }
  let c = r.resolve(l);
  if (!a) {
    let f = e == "pointer" || n.state.selection.head < o.pos && !u ? 1 : -1;
    a = au(n, c, o, f);
  }
  return a;
}
function Cl(n) {
  return n.editable ? n.hasFocus() : El(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Be(n, e = !1) {
  let t = n.state.selection;
  if (Sl(n, t), !Cl(n))
    return;
  let r = n.input.mouseDown;
  if (!e && J && r) {
    let i = n.domSelectionRange(), u = n.domObserver.currentSelection;
    if (i.anchorNode && u.anchorNode && _t(i.anchorNode, i.anchorOffset, u.anchorNode, u.anchorOffset) && r.delaySelUpdate()) {
      n.domObserver.setCurSelection();
      return;
    }
  }
  if (n.domObserver.disconnectSelection(), n.cursorWrapper)
    Od(n);
  else {
    let { anchor: i, head: u } = t, s, o;
    gs && !(t instanceof P) && (t.$from.parent.inlineContent || (s = bs(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = bs(n, t.to))), n.docView.setSelection(i, u, n, e), gs && (s && xs(s), o && xs(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Td(n));
  }
  n.domObserver.setCurSelection(), n.domObserver.connectSelection();
}
const gs = te || J && ll < 63;
function bs(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, u = r ? t.childNodes[r - 1] : null;
  if (te && i && i.contentEditable == "false")
    return ai(i);
  if ((!i || i.contentEditable == "false") && (!u || u.contentEditable == "false")) {
    if (i)
      return ai(i);
    if (u)
      return ai(u);
  }
}
function ai(n) {
  return n.contentEditable = "true", te && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function xs(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function Td(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!Cl(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Od(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, X(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && ue && tt <= 11 && (t.disabled = !0, t.disabled = !1);
}
function Sl(n, e) {
  if (e instanceof O) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (ys(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    ys(n);
}
function ys(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function au(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || P.between(e, t, r);
}
function ks(n) {
  return n.editable && !n.hasFocus() ? !1 : El(n);
}
function El(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Nd(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return _t(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Ri(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), u = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return u && I.findFrom(u, e);
}
function Ue(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Cs(n, e, t) {
  let r = n.state.selection;
  if (r instanceof P)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, u = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!u || u.isText || !u.isLeaf)
        return !1;
      let s = n.state.doc.resolve(i.pos + u.nodeSize * (e < 0 ? -1 : 1));
      return Ue(n, new P(r.$anchor, s));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Ri(n.state, e);
        return i && i instanceof O ? Ue(n, i) : !1;
      } else if (!(fe && t.indexOf("m") > -1)) {
        let i = r.$head, u = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, s;
        if (!u || u.isText)
          return !1;
        let o = e < 0 ? i.pos - u.nodeSize : i.pos;
        return u.isAtom || (s = n.docView.descAt(o)) && !s.contentDOM ? O.isSelectable(u) ? Ue(n, new O(e < 0 ? n.state.doc.resolve(i.pos - u.nodeSize) : i)) : Kn ? Ue(n, new P(n.state.doc.resolve(e < 0 ? o : o + u.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof O && r.node.isInline)
      return Ue(n, new P(e > 0 ? r.$to : r.$from));
    {
      let i = Ri(n.state, e);
      return i ? Ue(n, i) : !1;
    }
  }
}
function wr(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function hn(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Tt(n, e) {
  return e < 0 ? Fd(n) : vd(n);
}
function Fd(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, u, s = !1;
  for (pe && t.nodeType == 1 && r < wr(t) && hn(t.childNodes[r], -1) && (s = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let o = t.childNodes[r - 1];
        if (hn(o, -1))
          i = t, u = --r;
        else if (o.nodeType == 3)
          t = o, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (Dl(t))
        break;
      {
        let o = t.previousSibling;
        for (; o && hn(o, -1); )
          i = t.parentNode, u = X(o), o = o.previousSibling;
        if (o)
          t = o, r = wr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  s ? Pi(n, t, r) : i && Pi(n, i, u);
}
function vd(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = wr(t), u, s;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let o = t.childNodes[r];
      if (hn(o, 1))
        u = t, s = ++r;
      else
        break;
    } else {
      if (Dl(t))
        break;
      {
        let o = t.nextSibling;
        for (; o && hn(o, 1); )
          u = o.parentNode, s = X(o) + 1, o = o.nextSibling;
        if (o)
          t = o, r = 0, i = wr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  u && Pi(n, u, s);
}
function Dl(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function Id(n, e) {
  for (; n && e == n.childNodes.length && !Jn(n); )
    e = X(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function Rd(n, e) {
  for (; n && !e && !Jn(n); )
    e = X(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Pi(n, e, t) {
  if (e.nodeType != 3) {
    let u, s;
    (s = Id(e, t)) ? (e = s, t = 0) : (u = Rd(e, t)) && (e = u, t = u.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (Br(r)) {
    let u = document.createRange();
    u.setEnd(e, t), u.setStart(e, t), r.removeAllRanges(), r.addRange(u);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && Be(n);
  }, 50);
}
function Ss(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(J || al) && t.parent.inlineContent) {
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
function Es(n, e, t) {
  let r = n.state.selection;
  if (r instanceof P && !r.empty || t.indexOf("s") > -1 || fe && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: u } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = Ri(n.state, e);
    if (s && s instanceof O)
      return Ue(n, s);
  }
  if (!i.parent.inlineContent) {
    let s = e < 0 ? i : u, o = r instanceof le ? I.near(s, e) : I.findFrom(s, e);
    return o ? Ue(n, o) : !1;
  }
  return !1;
}
function Ds(n, e) {
  if (!(n.state.selection instanceof P))
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
function ws(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function Pd(n) {
  if (!te || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    ws(n, r, "true"), setTimeout(() => ws(n, r, "false"), 20);
  }
  return !1;
}
function $d(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function zd(n, e) {
  let t = e.keyCode, r = $d(e);
  if (t == 8 || fe && t == 72 && r == "c")
    return Ds(n, -1) || Tt(n, -1);
  if (t == 46 && !e.shiftKey || fe && t == 68 && r == "c")
    return Ds(n, 1) || Tt(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || fe && t == 66 && r == "c") {
    let i = t == 37 ? Ss(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Cs(n, i, r) || Tt(n, i);
  } else if (t == 39 || fe && t == 70 && r == "c") {
    let i = t == 39 ? Ss(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Cs(n, i, r) || Tt(n, i);
  } else {
    if (t == 38 || fe && t == 80 && r == "c")
      return Es(n, -1, r) || Tt(n, -1);
    if (t == 40 || fe && t == 78 && r == "c")
      return Pd(n) || Es(n, 1, r) || Tt(n, 1);
    if (r == (fe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function cu(n, e) {
  n.someProp("transformCopied", (p) => {
    e = p(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: u } = e;
  for (; i > 1 && u > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, u--;
    let p = r.firstChild;
    t.push(p.type.name, p.attrs != p.type.defaultAttrs ? p.attrs : null), r = p.content;
  }
  let s = n.someProp("clipboardSerializer") || Zt.fromSchema(n.state.schema), o = Ol(), l = o.createElement("div");
  l.appendChild(s.serializeFragment(r, { document: o }));
  let a = l.firstChild, c, f = 0;
  for (; a && a.nodeType == 1 && (c = Tl[a.nodeName.toLowerCase()]); ) {
    for (let p = c.length - 1; p >= 0; p--) {
      let d = o.createElement(c[p]);
      for (; l.firstChild; )
        d.appendChild(l.firstChild);
      l.appendChild(d), f++;
    }
    a = l.firstChild;
  }
  a && a.nodeType == 1 && a.setAttribute("data-pm-slice", `${i} ${u}${f ? ` -${f}` : ""} ${JSON.stringify(t)}`);
  let h = n.someProp("clipboardTextSerializer", (p) => p(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: l, text: h, slice: e };
}
function wl(n, e, t, r, i) {
  let u = i.parent.type.spec.code, s, o;
  if (!t && !e)
    return null;
  let l = !!e && (r || u || !t);
  if (l) {
    if (n.someProp("transformPastedText", (h) => {
      e = h(e, u || r, n);
    }), u)
      return o = new w(k.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (h) => {
        o = h(o, n, !0);
      }), o;
    let f = n.someProp("clipboardTextParser", (h) => h(e, i, r, n));
    if (f)
      o = f;
    else {
      let h = i.marks(), { schema: p } = n.state, d = Zt.fromSchema(p);
      s = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = s.appendChild(document.createElement("p"));
        m && g.appendChild(d.serializeNode(p.text(m, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (f) => {
      t = f(t, n);
    }), s = qd(t), Kn && Hd(s);
  let a = s && s.querySelector("[data-pm-slice]"), c = a && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(a.getAttribute("data-pm-slice") || "");
  if (c && c[3])
    for (let f = +c[3]; f > 0; f--) {
      let h = s.firstChild;
      for (; h && h.nodeType != 1; )
        h = h.nextSibling;
      if (!h)
        break;
      s = h;
    }
  if (o || (o = (n.someProp("clipboardParser") || n.someProp("domParser") || kn.fromSchema(n.state.schema)).parseSlice(s, {
    preserveWhitespace: !!(l || c),
    context: i,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !Bd.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), c)
    o = Ud(_s(o, +c[1], +c[2]), c[4]);
  else if (o = w.maxOpen(Ld(o.content, i), !0), o.openStart || o.openEnd) {
    let f = 0, h = 0;
    for (let p = o.content.firstChild; f < o.openStart && !p.type.spec.isolating; f++, p = p.firstChild)
      ;
    for (let p = o.content.lastChild; h < o.openEnd && !p.type.spec.isolating; h++, p = p.lastChild)
      ;
    o = _s(o, f, h);
  }
  return n.someProp("transformPasted", (f) => {
    o = f(o, n, l);
  }), o;
}
const Bd = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Ld(n, e) {
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
      if (a = s.length && u.length && Al(l, u, o, s[s.length - 1], 0))
        s[s.length - 1] = a;
      else {
        s.length && (s[s.length - 1] = Ml(s[s.length - 1], u.length));
        let c = _l(o, l);
        s.push(c), i = i.matchType(c.type), u = l;
      }
    }), s)
      return k.from(s);
  }
  return n;
}
function _l(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, k.from(n));
  return n;
}
function Al(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let u = Al(n, e, t, r.lastChild, i + 1);
    if (u)
      return r.copy(r.content.replaceChild(r.childCount - 1, u));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(k.from(_l(t, n, i + 1))));
  }
}
function Ml(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, Ml(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(k.empty, !0);
  return n.copy(t.append(r));
}
function $i(n, e, t, r, i, u) {
  let s = e < 0 ? n.firstChild : n.lastChild, o = s.content;
  return n.childCount > 1 && (u = 0), i < r - 1 && (o = $i(o, e, t, r, i + 1, u)), i >= t && (o = e < 0 ? s.contentMatchAt(0).fillBefore(o, u <= i).append(o) : o.append(s.contentMatchAt(s.childCount).fillBefore(k.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(o));
}
function _s(n, e, t) {
  return e < n.openStart && (n = new w($i(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new w($i(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const Tl = {
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
function Ol() {
  return document.implementation.createHTMLDocument("title");
}
let ci = null;
function Vd(n) {
  let e = window.trustedTypes;
  return e ? (ci || (ci = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), ci.createHTML(n)) : n;
}
function qd(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Ol(), r = t.body, i = /<([a-z][^>\s]+)/i.exec(n), u;
  if ((u = i && Tl[i[1].toLowerCase()]) && (n = u.map((s) => "<" + s + ">").join("") + n + u.map((s) => "</" + s + ">").reverse().join("")), r.innerHTML = Vd(n), u)
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
function Hd(n) {
  let e = n.querySelectorAll(J ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function Ud(n, e) {
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
  return new w(i, u, s);
}
const re = {}, ie = {}, Wd = { touchstart: !0, touchmove: !0 };
class jd {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function Jd(n) {
  for (let e in re) {
    let t = re[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      Zd(n, r) && !fu(n, r) && (n.editable || !(r.type in ie)) && t(n, r);
    }, Wd[e] ? { passive: !0 } : void 0);
  }
  te && n.dom.addEventListener("input", () => null), zi(n);
}
function ze(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function Kd(n) {
  n.input.mouseDown && n.input.mouseDown.done(), n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function zi(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => fu(n, r));
  });
}
function fu(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function Zd(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function Gd(n, e) {
  !fu(n, e) && re[e.type] && (n.editable || !(e.type in ie)) && re[e.type](n, e);
}
ie.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Il(n) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !($e && J && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), jt && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, dt(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || zd(n, t) ? t.preventDefault() : ze(n, "key");
};
ie.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
ie.keypress = (n, e) => {
  let t = e;
  if (Il(n) || !t.charCode || t.ctrlKey && !t.altKey || fe && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof P) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode), u = () => n.state.tr.insertText(i).scrollIntoView();
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (s) => s(n, r.$from.pos, r.$to.pos, i, u)) && n.dispatch(u()), t.preventDefault();
  }
};
function Gn(n) {
  return { left: n.clientX, top: n.clientY };
}
function Yd(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function du(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let u = n.state.doc.resolve(r);
  for (let s = u.depth + 1; s > 0; s--)
    if (n.someProp(e, (o) => s > u.depth ? o(n, t, u.nodeAfter, u.before(s), i, !0) : o(n, t, u.node(s), u.before(s), i, !1)))
      return !0;
  return !1;
}
function Yn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function Xd(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && O.isSelectable(r) ? (Yn(n, new O(t)), !0) : !1;
}
function Qd(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof O && (r = t.node);
  let u = n.state.doc.resolve(e);
  for (let s = u.depth + 1; s > 0; s--) {
    let o = s > u.depth ? u.nodeAfter : u.node(s);
    if (O.isSelectable(o)) {
      r && t.$from.depth > 0 && s >= t.$from.depth && u.before(t.$from.depth + 1) == t.$from.pos ? i = u.before(t.$from.depth) : i = u.before(s);
      break;
    }
  }
  return i != null ? (Yn(n, O.create(n.state.doc, i)), !0) : !1;
}
function eh(n, e, t, r, i) {
  return du(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (u) => u(n, e, r)) || (i ? Qd(n, t) : Xd(n, t));
}
function th(n, e, t, r) {
  return du(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function nh(n, e, t, r) {
  return du(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || rh(n, t, r);
}
function rh(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = Nl(n, e, !0), i = n.state.doc;
  return r ? (Yn(n, r), r instanceof P && i.eq(n.state.doc) && (n.input.mouseDown = new uh(n, r)), !0) : !1;
}
function Nl(n, e, t) {
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? P.create(r, 0, r.content.size) : null;
  let i = r.resolve(e);
  for (let u = i.depth + 1; u > 0; u--) {
    let s = u > i.depth ? i.nodeAfter : i.node(u), o = i.before(u);
    if (s.inlineContent)
      return P.create(r, o + 1, o + 1 + s.content.size);
    if (t && O.isSelectable(s))
      return O.create(r, o);
  }
  return null;
}
function hu(n) {
  return _r(n);
}
const Fl = fe ? "metaKey" : "ctrlKey";
re.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = hu(n), i = Date.now(), u = "singleClick";
  i - n.input.lastClick.time < 500 && Yd(t, n.input.lastClick) && !t[Fl] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? u = "doubleClick" : n.input.lastClick.type == "doubleClick" && (u = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: u, button: t.button }, n.input.mouseDown && n.input.mouseDown.done();
  let s = n.posAtCoords(Gn(t));
  s && (u == "singleClick" ? n.input.mouseDown = new ih(n, s, t, !!r) : (u == "doubleClick" ? th : nh)(n, s.pos, s.inside, t) ? t.preventDefault() : ze(n, "pointer"));
};
class vl {
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
class ih extends vl {
  constructor(e, t, r, i) {
    super(e), this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.startDoc = e.state.doc, this.selectNode = !!r[Fl], this.allowDefault = r.shiftKey;
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
    r.button == 0 && (u.type.spec.draggable && u.type.spec.selectable !== !1 || a instanceof O && a.from <= s && a.to > s) && (this.mightDrag = {
      node: u,
      pos: s,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && pe && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), ze(e, "pointer");
  }
  done() {
    super.done(), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => {
      this.view.isDestroyed || Be(this.view);
    });
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Gn(e))), this.updateAllowDefault(e), this.allowDefault || !t ? ze(this.view, "pointer") : eh(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    te && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    J && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Yn(this.view, I.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : ze(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), ze(this.view, "pointer"), super.move(e);
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
  delaySelUpdate() {
    return this.allowDefault ? (this.delayedSelectionSync = !0, !0) : !1;
  }
}
class uh extends vl {
  constructor(e, t) {
    super(e), this.startSelection = t, this.startDoc = e.state.doc;
  }
  move(e) {
    if (e.buttons == 0 || this.view.isDestroyed || !this.view.state.doc.eq(this.startDoc)) {
      this.done();
      return;
    }
    e.preventDefault(), ze(this.view, "pointer");
    let t = this.view.posAtCoords(Gn(e)), r = t && Nl(this.view, t.inside, !1);
    if (!r)
      return;
    let { doc: i } = this.view.state, u = this.startSelection, [s, o] = r.from < u.from ? [u.to, r.from] : [u.from, r.to];
    Yn(this.view, P.create(i, s, o));
  }
}
re.touchstart = (n) => {
  n.input.lastTouch = Date.now(), hu(n), ze(n, "pointer");
};
re.touchmove = (n) => {
  n.input.lastTouch = Date.now(), ze(n, "pointer");
};
re.contextmenu = (n) => hu(n);
function Il(n, e) {
  return n.composing ? !0 : te && Math.abs(Date.now() - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const sh = $e ? 5e3 : -1;
ie.compositionstart = ie.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof P && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || J && al && oh(n)))
      n.markCursor = n.state.storedMarks || t.marks(), _r(n, !0), n.markCursor = null;
    else if (_r(n, !e.selection.empty), pe && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  Rl(n, sh);
};
function oh(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
ie.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now(), n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Rl(n, 20));
};
function Rl(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => _r(n), e));
}
function Pl(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Date.now()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function lh(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Qf(e.focusNode, e.focusOffset), r = ed(e.focusNode, e.focusOffset);
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
function _r(n, e = !1) {
  if (!($e && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Pl(n), e || n.docView && n.docView.dirty) {
      let t = lu(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function ah(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Dn = ue && tt < 15 || jt && id < 604;
re.copy = ie.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let u = Dn ? null : t.clipboardData, s = r.content(), { dom: o, text: l } = cu(n, s);
  u ? (t.preventDefault(), u.clearData(), u.setData("text/html", o.innerHTML), u.setData("text/plain", l)) : ah(n, o), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function ch(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function fh(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? wn(n, r.value, null, i, e) : wn(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function wn(n, e, t, r, i) {
  let u = wl(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, i, u || w.empty)))
    return !0;
  if (!u)
    return !1;
  let s = ch(u), o = s ? n.state.tr.replaceSelectionWith(s, r) : n.state.tr.replaceSelection(u);
  return n.dispatch(o.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function $l(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
ie.paste = (n, e) => {
  let t = e;
  if (n.composing && !$e)
    return;
  let r = Dn ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && wn(n, $l(r), r.getData("text/html"), i, t) ? t.preventDefault() : fh(n, t);
};
class zl {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const dh = fe ? "altKey" : "ctrlKey";
function Bl(n, e) {
  let t;
  return n.someProp("dragCopies", (r) => {
    t = t || r(e);
  }), t != null ? !t : !e[dh];
}
re.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, u = i.empty ? null : n.posAtCoords(Gn(t)), s;
  if (!(u && u.pos >= i.from && u.pos <= (i instanceof O ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      s = O.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let f = n.docView.nearestDesc(t.target, !0);
      f && f.node.type.spec.draggable && f != n.docView && (s = O.create(n.state.doc, f.posBefore));
    }
  }
  let o = (s || n.state.selection).content(), { dom: l, text: a, slice: c } = cu(n, o);
  (!t.dataTransfer.files.length || !J || ll > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Dn ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Dn || t.dataTransfer.setData("text/plain", a), n.dragging = new zl(c, Bl(n, t), s);
};
re.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
ie.dragover = ie.dragenter = (n, e) => e.preventDefault();
ie.drop = (n, e) => {
  try {
    hh(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function hh(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Gn(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), u = t && t.slice;
  u ? n.someProp("transformPasted", (p) => {
    u = p(u, n, !1);
  }) : u = wl(n, $l(e.dataTransfer), Dn ? null : e.dataTransfer.getData("text/html"), !1, i);
  let s = !!(t && Bl(n, e));
  if (n.someProp("handleDrop", (p) => p(n, e, u || w.empty, s))) {
    e.preventDefault();
    return;
  }
  if (!u)
    return;
  e.preventDefault();
  let o = u ? Yc(n.state.doc, i.pos, u) : i.pos;
  o == null && (o = i.pos);
  let l = n.state.tr;
  if (s) {
    let { node: p } = t;
    p ? p.replace(l) : l.deleteSelection();
  }
  let a = l.mapping.map(o), c = u.openStart == 0 && u.openEnd == 0 && u.content.childCount == 1, f = l.doc;
  if (c ? l.replaceRangeWith(a, a, u.content.firstChild) : l.replaceRange(a, a, u), l.doc.eq(f))
    return;
  let h = l.doc.resolve(a);
  if (c && O.isSelectable(u.content.firstChild) && h.nodeAfter && h.nodeAfter.sameMarkup(u.content.firstChild))
    l.setSelection(new O(h));
  else {
    let p = l.mapping.map(o);
    l.mapping.maps[l.mapping.maps.length - 1].forEach((d, m, g, y) => p = y), l.setSelection(au(n, h, l.doc.resolve(p)));
  }
  n.focus(), n.dispatch(l.setMeta("uiEvent", "drop"));
}
re.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Be(n);
  }, 20));
};
re.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
re.beforeinput = (n, e) => {
  if (J && $e && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (u) => u(n, dt(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in ie)
  re[n] = ie[n];
function _n(n, e) {
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
class Ar {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Ct, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: u, deleted: s } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return s ? null : new he(u - r, u - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof Ar && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && _n(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class it {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Ct;
  }
  map(e, t, r, i) {
    let u = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, s = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return u >= s ? null : new he(u, s, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof it && _n(this.attrs, e.attrs) && _n(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof it;
  }
  destroy() {
  }
}
class pu {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Ct;
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
    return this == e || e instanceof pu && _n(this.attrs, e.attrs) && _n(this.spec, e.spec);
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
    return new he(e, e, new Ar(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new he(e, t, new it(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new he(e, t, new pu(r, i));
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
    return this.type instanceof it;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof Ar;
  }
}
const vt = [], Ct = {};
class L {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : vt, this.children = t.length ? t : vt;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? Mr(t, e, 0, Ct) : Q;
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
    return this == Q || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Ct);
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
    return this.children.length ? ph(this.children, s || [], e, t, r, i, u) : s ? new L(s.sort(St), vt) : Q;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Q ? L.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, u = 0;
    e.forEach((o, l) => {
      let a = l + r, c;
      if (c = Vl(t, o, a)) {
        for (i || (i = this.children.slice()); u < i.length && i[u] < l; )
          u += 3;
        i[u] == l ? i[u + 2] = i[u + 2].addInner(o, c, a + 1) : i.splice(u, 0, l, l + o.nodeSize, Mr(c, o, a + 1, Ct)), u += 3;
      }
    });
    let s = Ll(u ? ql(t) : t, -r);
    for (let o = 0; o < s.length; o++)
      s[o].type.valid(e, s[o]) || s.splice(o--, 1);
    return new L(s.length ? this.local.concat(s).sort(St) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Q ? this : this.removeInner(e, 0);
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
      a != Q ? r[u + 2] = a : (r.splice(u, 3), u -= 3);
    }
    if (i.length) {
      for (let u = 0, s; u < e.length; u++)
        if (s = e[u])
          for (let o = 0; o < i.length; o++)
            i[o].eq(s, t) && (i == this.local && (i = this.local.slice()), i.splice(o--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new L(i, r) : Q;
  }
  forChild(e, t) {
    if (this == Q)
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
      if (l.from < s && l.to > u && l.type instanceof it) {
        let a = Math.max(u, l.from) - u, c = Math.min(s, l.to) - u;
        a < c && (i || (i = [])).push(l.copy(a, c));
      }
    }
    if (i) {
      let o = new L(i.sort(St), vt);
      return r ? new Je([o, r]) : o;
    }
    return r || Q;
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
    return mu(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Q)
      return vt;
    if (e.inlineContent || !this.local.some(it.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof it || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
L.empty = new L([], []);
L.removeOverlap = mu;
const Q = L.empty;
class Je {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, Ct));
    return Je.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return L.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let u = this.members[i].forChild(e, t);
      u != Q && (u instanceof Je ? r = r.concat(u.members) : r.push(u));
    }
    return Je.from(r);
  }
  eq(e) {
    if (!(e instanceof Je) || e.members.length != this.members.length)
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
    return t ? mu(r ? t : t.sort(St)) : vt;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Q;
      case 1:
        return e[0];
      default:
        return new Je(e.every((t) => t instanceof L) ? e : e.reduce((t, r) => t.concat(r instanceof L ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function ph(n, e, t, r, i, u, s) {
  let o = n.slice();
  for (let a = 0, c = u; a < t.maps.length; a++) {
    let f = 0;
    t.maps[a].forEach((h, p, d, m) => {
      let g = m - d - (p - h);
      for (let y = 0; y < o.length; y += 3) {
        let E = o[y + 1];
        if (E < 0 || h > E + c - f)
          continue;
        let D = o[y] + c - f;
        p >= D ? o[y + 1] = h <= D ? -2 : -1 : h >= c && g && (o[y] += g, o[y + 1] += g);
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
      let h = t.map(n[a + 1] + u, -1), p = h - i, { index: d, offset: m } = r.content.findIndex(f), g = r.maybeChild(d);
      if (g && m == f && m + g.nodeSize == p) {
        let y = o[a + 2].mapInner(t, g, c + 1, n[a] + u + 1, s);
        y != Q ? (o[a] = f, o[a + 1] = p, o[a + 2] = y) : (o[a + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let a = mh(o, n, e, t, i, u, s), c = Mr(a, r, 0, s);
    e = c.local;
    for (let f = 0; f < o.length; f += 3)
      o[f + 1] < 0 && (o.splice(f, 3), f -= 3);
    for (let f = 0, h = 0; f < c.children.length; f += 3) {
      let p = c.children[f];
      for (; h < o.length && o[h] < p; )
        h += 3;
      o.splice(h, 0, c.children[f], c.children[f + 1], c.children[f + 2]);
    }
  }
  return new L(e.sort(St), o);
}
function Ll(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new he(i.from + e, i.to + e, i.type));
  }
  return t;
}
function mh(n, e, t, r, i, u, s) {
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
function Vl(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let u = 0, s; u < n.length; u++)
    (s = n[u]) && s.from > t && s.to < r && ((i || (i = [])).push(s), n[u] = null);
  return i;
}
function ql(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function Mr(n, e, t, r) {
  let i = [], u = !1;
  e.forEach((o, l) => {
    let a = Vl(n, o, l + t);
    if (a) {
      u = !0;
      let c = Mr(a, o, t + l + 1, r);
      c != Q && i.push(l, l + o.nodeSize, c);
    }
  });
  let s = Ll(u ? ql(n) : n, -t).sort(St);
  for (let o = 0; o < s.length; o++)
    s[o].type.valid(e, s[o]) || (r.onRemove && r.onRemove(s[o].spec), s.splice(o--, 1));
  return s.length || i.length ? new L(s, i) : Q;
}
function St(n, e) {
  return n.from - e.from || n.to - e.to;
}
function mu(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let u = e[i];
        if (u.from == r.from) {
          u.to != r.to && (e == n && (e = n.slice()), e[i] = u.copy(u.from, r.to), As(e, i + 1, u.copy(r.to, u.to)));
          continue;
        } else {
          u.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, u.from), As(e, i, r.copy(u.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function As(n, e, t) {
  for (; e < n.length && St(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function fi(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Q && e.push(r);
  }), n.cursorWrapper && e.push(L.create(n.state.doc, [n.cursorWrapper.deco])), Je.from(e);
}
const gh = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, bh = ue && tt <= 11;
class xh {
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
class yh {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new xh(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      ue && tt <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : te && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), bh && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, gh)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (ks(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Be(this.view);
      if (ue && tt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && _t(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let u = e.focusNode; u; u = Wt(u))
      t.add(u);
    for (let u = e.anchorNode; u; u = Wt(u))
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && ks(e) && !this.ignoreSelectionChange(r), u = -1, s = -1, o = !1, l = [];
    if (e.editable)
      for (let c = 0; c < t.length; c++) {
        let f = this.registerMutation(t[c], l);
        f && (u = u < 0 ? f.from : Math.min(f.from, u), s = s < 0 ? f.to : Math.max(f.to, s), f.typeOver && (o = !0));
      }
    if (l.some((c) => c.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46 || J && (e.composing || e.input.compositionEndedAt > Date.now() - 50) && t.some((c) => c.type == "childList" && c.removedNodes.length))) {
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
    } else if (pe && l.length) {
      let c = l.filter((f) => f.nodeName == "BR");
      if (c.length == 2) {
        let [f, h] = c;
        f.parentNode && f.parentNode.parentNode == h.parentNode ? h.remove() : f.remove();
      } else {
        let { focusNode: f } = this.currentSelection;
        for (let h of c) {
          let p = h.parentNode;
          p && p.nodeName == "LI" && (!f || Sh(e, f) != p) && h.remove();
        }
      }
    }
    let a = null;
    u < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Br(r) && (a = lu(e)) && a.eq(I.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Be(e), this.currentSelection.set(r), e.scrollToSelection()) : (u > -1 || i) && (u > -1 && (e.docView.markDirty(u, s), kh(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, Eh(e, l)), this.handleDOMChange(u, s, o, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Be(e), this.currentSelection.set(r));
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
      if (ue && tt <= 11 && e.addedNodes.length)
        for (let c = 0; c < e.addedNodes.length; c++) {
          let { previousSibling: f, nextSibling: h } = e.addedNodes[c];
          (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (i = f), (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (u = h);
        }
      let s = i && i.parentNode == e.target ? X(i) + 1 : 0, o = r.localPosFromDOM(e.target, s, -1), l = u && u.parentNode == e.target ? X(u) : e.target.childNodes.length, a = r.localPosFromDOM(e.target, l, 1);
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
let Ms = /* @__PURE__ */ new WeakMap(), Ts = !1;
function kh(n) {
  if (!Ms.has(n) && (Ms.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = pe, Ts)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Ts = !0;
  }
}
function Os(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, u = e.endOffset, s = n.domAtPos(n.state.selection.anchor);
  return _t(s.node, s.offset, i, u) && ([t, r, i, u] = [i, u, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: u };
}
function Ch(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return Os(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? Os(n, t) : null;
}
function Sh(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function Eh(n, e) {
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
function Dh(n, e, t) {
  let { node: r, fromOffset: i, toOffset: u, from: s, to: o } = n.docView.parseRange(e, t), l = n.domSelectionRange(), a, c = l.anchorNode;
  if (c && n.dom.contains(c.nodeType == 1 ? c : c.parentNode) && (a = [{ node: c, offset: l.anchorOffset }], Br(l) || a.push({ node: l.focusNode, offset: l.focusOffset })), J && n.input.lastKeyCode === 8)
    for (let g = u; g > i; g--) {
      let y = r.childNodes[g - 1], E = y.pmViewDesc;
      if (y.nodeName == "BR" && !E) {
        u = g;
        break;
      }
      if (!E || E.size)
        break;
    }
  let f = n.state.doc, h = n.someProp("domParser") || kn.fromSchema(n.state.schema), p = f.resolve(s), d = null, m = h.parse(r, {
    topNode: p.parent,
    topMatch: p.parent.contentMatchAt(p.index()),
    topOpen: !0,
    from: i,
    to: u,
    preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: a,
    ruleFromNode: wh,
    context: p
  });
  if (a && a[0].pos != null) {
    let g = a[0].pos, y = a[1] && a[1].pos;
    y == null && (y = g), d = { anchor: g + s, head: y + s };
  }
  return { doc: m, sel: d, from: s, to: o };
}
function wh(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (te && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || te && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const _h = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Ah(n, e, t, r, i) {
  let u = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let _ = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, v = lu(n, _);
    if (v && !n.state.selection.eq(v)) {
      if (J && $e && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (H) => H(n, dt(13, "Enter"))))
        return;
      let T = n.state.tr.setSelection(v);
      _ == "pointer" ? T.setMeta("pointer", !0) : _ == "key" && T.scrollIntoView(), u && T.setMeta("composition", u), n.dispatch(T);
    }
    return;
  }
  let s = n.state.doc.resolve(e), o = s.sharedDepth(t);
  e = s.before(o + 1), t = n.state.doc.resolve(t).after(o + 1);
  let l = n.state.selection, a = Dh(n, e, t), c = n.state.doc, f = c.slice(a.from, a.to), h, p;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (h = n.state.selection.to, p = "end") : (h = n.state.selection.from, p = "start"), n.input.lastKeyCode = null;
  let d = Oh(f.content, a.doc.content, a.from, h, p);
  if (d && n.input.domChangeCount++, (jt && n.input.lastIOSEnter > Date.now() - 225 || $e) && i.some((_) => _.nodeType == 1 && !_h.test(_.nodeName)) && (!d || d.endA >= d.endB) && n.someProp("handleKeyDown", (_) => _(n, dt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!d)
    if (r && l instanceof P && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(a.sel && a.sel.anchor != a.sel.head))
      d = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (a.sel) {
        let _ = Ns(n, n.state.doc, a.sel);
        if (_ && !_.eq(n.state.selection)) {
          let v = n.state.tr.setSelection(_);
          u && v.setMeta("composition", u), n.dispatch(v);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && d.start == d.endB && n.state.selection instanceof P && (d.start > n.state.selection.from && d.start <= n.state.selection.from + 2 && n.state.selection.from >= a.from ? d.start = n.state.selection.from : d.endA < n.state.selection.to && d.endA >= n.state.selection.to - 2 && n.state.selection.to <= a.to && (d.endB += n.state.selection.to - d.endA, d.endA = n.state.selection.to)), ue && tt <= 11 && d.endB == d.start + 1 && d.endA == d.start && d.start > a.from && a.doc.textBetween(d.start - a.from - 1, d.start - a.from + 1) == "  " && (d.start--, d.endA--, d.endB--);
  let m = a.doc.resolveNoCache(d.start - a.from), g = a.doc.resolveNoCache(d.endB - a.from), y = c.resolve(d.start), E = m.sameParent(g) && m.parent.inlineContent && y.end() >= d.endA;
  if ((jt && n.input.lastIOSEnter > Date.now() - 225 && (!E || i.some((_) => _.nodeName == "DIV" || _.nodeName == "P")) || !E && m.pos < a.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(a.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (_) => _(n, dt(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > d.start && Th(c, d.start, d.endA, m, g) && n.someProp("handleKeyDown", (_) => _(n, dt(8, "Backspace")))) {
    $e && J && n.domObserver.suppressSelectionUpdates();
    return;
  }
  J && d.endB == d.start && (n.input.lastChromeDelete = Date.now()), $e && !E && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && a.sel && a.sel.anchor == a.sel.head && a.sel.head == d.endA && (d.endB -= 2, g = a.doc.resolveNoCache(d.endB - a.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(_) {
      return _(n, dt(13, "Enter"));
    });
  }, 20));
  let D = d.start, A = d.endA, M = (_) => {
    let v = _ || n.state.tr.replace(D, A, a.doc.slice(d.start - a.from, d.endB - a.from));
    if (a.sel) {
      let T = Ns(n, v.doc, a.sel);
      T && !(J && n.composing && T.empty && (d.start != d.endB || n.input.lastChromeDelete < Date.now() - 100) && (T.head == D || T.head == v.mapping.map(A) - 1) || ue && T.empty && T.head == D) && v.setSelection(T);
    }
    return u && v.setMeta("composition", u), v.scrollIntoView();
  }, F;
  if (E)
    if (m.pos == g.pos) {
      ue && tt <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Be(n), 20));
      let _ = M(n.state.tr.delete(D, A)), v = c.resolve(d.start).marksAcross(c.resolve(d.endA));
      v && _.ensureMarks(v), n.dispatch(_);
    } else if (
      // Adding or removing a mark
      d.endA == d.endB && (F = Mh(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, d.endA - y.start())))
    ) {
      let _ = M(n.state.tr);
      F.type == "add" ? _.addMark(D, A, F.mark) : _.removeMark(D, A, F.mark), n.dispatch(_);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let _ = m.parent.textBetween(m.parentOffset, g.parentOffset), v = () => M(n.state.tr.insertText(_, D, A));
      n.someProp("handleTextInput", (T) => T(n, D, A, _, v)) || n.dispatch(v());
    } else
      n.dispatch(M());
  else
    n.dispatch(M());
}
function Ns(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : au(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Mh(n, e) {
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
function Th(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    di(r, !0, !1) < i.pos
  )
    return !1;
  let u = n.resolve(e);
  if (!r.parent.isTextblock) {
    let o = u.nodeAfter;
    return o != null && t == e + o.nodeSize;
  }
  if (u.parentOffset < u.parent.content.size || !u.parent.isTextblock)
    return !1;
  let s = n.resolve(di(u, !0, !0));
  return !s.parent.isTextblock || s.pos > t || di(s, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(s.parent.content);
}
function di(n, e, t) {
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
function Oh(n, e, t, r, i) {
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
class Hl {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new jd(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Ps), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Is(this), vs(this), this.nodeViews = Rs(this), this.docView = ps(this.state.doc, Fs(this), fi(this), this.dom, this), this.domObserver = new yh(this, (r, i, u, s) => Ah(this, r, i, u, s)), this.domObserver.start(), Jd(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && zi(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Ps), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    e.storedMarks && this.composing && (Pl(this), s = !0), this.state = e;
    let o = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (o || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let p = Rs(this);
      Fh(p, this.nodeViews) && (this.nodeViews = p, u = !0);
    }
    (o || t.handleDOMEvents != this._props.handleDOMEvents) && zi(this), this.editable = Is(this), vs(this);
    let l = fi(this), a = Fs(this), c = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", f = u || !this.docView.matchesNode(e.doc, a, l);
    (f || !e.selection.eq(i.selection)) && (s = !0);
    let h = c == "preserve" && s && this.dom.style.overflowAnchor == null && od(this);
    if (s) {
      this.domObserver.stop();
      let p = f && (ue || J) && !this.composing && !i.selection.empty && !e.selection.empty && Nh(i.selection, e.selection);
      if (f) {
        let m = J ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = lh(this)), (u || !this.docView.update(e.doc, a, l, this)) && (this.docView.updateOuterDeco(a), this.docView.destroy(), this.docView = ps(e.doc, a, l, this.dom, this)), m && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (p = !0);
      }
      let d = this.input.mouseDown;
      p || !(d && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Nd(this) && d.delaySelUpdate()) ? Be(this, p) : (Sl(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : h && ld(h);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof O) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && as(this, t.getBoundingClientRect(), e);
      } else
        as(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new zl(e.slice, e.move, i < 0 ? void 0 : O.create(this.state.doc, i));
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
    if (ue) {
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
    this.domObserver.stop(), this.editable && ad(this.dom), Be(this), this.domObserver.start();
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
    return pd(this, e);
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
    return pl(this, e, t);
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
    return yd(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return wn(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return wn(this, e, null, !0, t || new ClipboardEvent("paste"));
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
    return cu(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (Kd(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], fi(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Yf());
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
    return Gd(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? te && this.root.nodeType === 11 && nd(this.dom.ownerDocument) == this.dom && Ch(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Hl.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function Fs(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [he.node(0, n.state.doc.content.size, e)];
}
function vs(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: he.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Is(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Nh(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Rs(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Fh(n, e) {
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
function Ps(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
const $s = {};
function vh(n) {
  let e = $s[n];
  if (e)
    return e;
  e = $s[n] = [];
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
function Jt(n, e) {
  typeof e != "string" && (e = Jt.defaultChars);
  const t = vh(e);
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
Jt.defaultChars = ";/?:@&=+$,#";
Jt.componentChars = "";
const zs = {};
function Ih(n) {
  let e = zs[n];
  if (e)
    return e;
  e = zs[n] = [];
  for (let t = 0; t < 128; t++) {
    const r = String.fromCharCode(t);
    /^[0-9a-z]$/i.test(r) ? e.push(r) : e.push("%" + ("0" + t.toString(16).toUpperCase()).slice(-2));
  }
  for (let t = 0; t < n.length; t++)
    e[n.charCodeAt(t)] = n[t];
  return e;
}
function Xn(n, e, t) {
  typeof e != "string" && (t = e, e = Xn.defaultChars), typeof t > "u" && (t = !0);
  const r = Ih(e);
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
Xn.defaultChars = ";/?:@&=+$,-_.!~*'()#";
Xn.componentChars = "-_.!~*'()";
function gu(n) {
  let e = "";
  return e += n.protocol || "", e += n.slashes ? "//" : "", e += n.auth ? n.auth + "@" : "", n.hostname && n.hostname.indexOf(":") !== -1 ? e += "[" + n.hostname + "]" : e += n.hostname || "", e += n.port ? ":" + n.port : "", e += n.pathname || "", e += n.search || "", e += n.hash || "", e;
}
function Tr() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
const Rh = /^([a-z0-9.+-]+:)/i, Ph = /:[0-9]*$/, $h = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, zh = ["<", ">", '"', "`", " ", "\r", `
`, "	"], Bh = ["{", "}", "|", "\\", "^", "`"].concat(zh), Lh = ["'"].concat(Bh), Bs = ["%", "/", "?", ";", "#"].concat(Lh), Ls = ["/", "?", "#"], Vh = 255, Vs = /^[+a-z0-9A-Z_-]{0,63}$/, qh = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, qs = {
  javascript: !0,
  "javascript:": !0
}, Hs = {
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
function bu(n, e) {
  if (n && n instanceof Tr) return n;
  const t = new Tr();
  return t.parse(n, e), t;
}
Tr.prototype.parse = function(n, e) {
  let t, r, i, u = n;
  if (u = u.trim(), !e && n.split("#").length === 1) {
    const a = $h.exec(u);
    if (a)
      return this.pathname = a[1], a[2] && (this.search = a[2]), this;
  }
  let s = Rh.exec(u);
  if (s && (s = s[0], t = s.toLowerCase(), this.protocol = s, u = u.substr(s.length)), (e || s || u.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = u.substr(0, 2) === "//", i && !(s && qs[s]) && (u = u.substr(2), this.slashes = !0)), !qs[s] && (i || s && !Hs[s])) {
    let a = -1;
    for (let d = 0; d < Ls.length; d++)
      r = u.indexOf(Ls[d]), r !== -1 && (a === -1 || r < a) && (a = r);
    let c, f;
    a === -1 ? f = u.lastIndexOf("@") : f = u.lastIndexOf("@", a), f !== -1 && (c = u.slice(0, f), u = u.slice(f + 1), this.auth = c), a = -1;
    for (let d = 0; d < Bs.length; d++)
      r = u.indexOf(Bs[d]), r !== -1 && (a === -1 || r < a) && (a = r);
    a === -1 && (a = u.length), u[a - 1] === ":" && a--;
    const h = u.slice(0, a);
    u = u.slice(a), this.parseHost(h), this.hostname = this.hostname || "";
    const p = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!p) {
      const d = this.hostname.split(/\./);
      for (let m = 0, g = d.length; m < g; m++) {
        const y = d[m];
        if (y && !y.match(Vs)) {
          let E = "";
          for (let D = 0, A = y.length; D < A; D++)
            y.charCodeAt(D) > 127 ? E += "x" : E += y[D];
          if (!E.match(Vs)) {
            const D = d.slice(0, m), A = d.slice(m + 1), M = y.match(qh);
            M && (D.push(M[1]), A.unshift(M[2])), A.length && (u = A.join(".") + u), this.hostname = D.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > Vh && (this.hostname = ""), p && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  const o = u.indexOf("#");
  o !== -1 && (this.hash = u.substr(o), u = u.slice(0, o));
  const l = u.indexOf("?");
  return l !== -1 && (this.search = u.substr(l), u = u.slice(0, l)), u && (this.pathname = u), Hs[t] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
Tr.prototype.parseHost = function(n) {
  let e = Ph.exec(n);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), n = n.substr(0, n.length - e.length)), n && (this.hostname = n);
};
const Hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Jt,
  encode: Xn,
  format: gu,
  parse: bu
}, Symbol.toStringTag, { value: "Module" })), Ul = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Wl = /[\0-\x1F\x7F-\x9F]/, Uh = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, xu = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, jl = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, Jl = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, Wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: Ul,
  Cc: Wl,
  Cf: Uh,
  P: xu,
  S: jl,
  Z: Jl
}, Symbol.toStringTag, { value: "Module" })), jh = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((n) => n.charCodeAt(0))
), Jh = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((n) => n.charCodeAt(0))
);
var hi;
const Kh = /* @__PURE__ */ new Map([
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
]), Zh = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (hi = String.fromCodePoint) !== null && hi !== void 0 ? hi : function(n) {
    let e = "";
    return n > 65535 && (n -= 65536, e += String.fromCharCode(n >>> 10 & 1023 | 55296), n = 56320 | n & 1023), e += String.fromCharCode(n), e;
  }
);
function Gh(n) {
  var e;
  return n >= 55296 && n <= 57343 || n > 1114111 ? 65533 : (e = Kh.get(n)) !== null && e !== void 0 ? e : n;
}
var j;
(function(n) {
  n[n.NUM = 35] = "NUM", n[n.SEMI = 59] = "SEMI", n[n.EQUALS = 61] = "EQUALS", n[n.ZERO = 48] = "ZERO", n[n.NINE = 57] = "NINE", n[n.LOWER_A = 97] = "LOWER_A", n[n.LOWER_F = 102] = "LOWER_F", n[n.LOWER_X = 120] = "LOWER_X", n[n.LOWER_Z = 122] = "LOWER_Z", n[n.UPPER_A = 65] = "UPPER_A", n[n.UPPER_F = 70] = "UPPER_F", n[n.UPPER_Z = 90] = "UPPER_Z";
})(j || (j = {}));
const Yh = 32;
var et;
(function(n) {
  n[n.VALUE_LENGTH = 49152] = "VALUE_LENGTH", n[n.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", n[n.JUMP_TABLE = 127] = "JUMP_TABLE";
})(et || (et = {}));
function Bi(n) {
  return n >= j.ZERO && n <= j.NINE;
}
function Xh(n) {
  return n >= j.UPPER_A && n <= j.UPPER_F || n >= j.LOWER_A && n <= j.LOWER_F;
}
function Qh(n) {
  return n >= j.UPPER_A && n <= j.UPPER_Z || n >= j.LOWER_A && n <= j.LOWER_Z || Bi(n);
}
function e0(n) {
  return n === j.EQUALS || Qh(n);
}
var U;
(function(n) {
  n[n.EntityStart = 0] = "EntityStart", n[n.NumericStart = 1] = "NumericStart", n[n.NumericDecimal = 2] = "NumericDecimal", n[n.NumericHex = 3] = "NumericHex", n[n.NamedEntity = 4] = "NamedEntity";
})(U || (U = {}));
var Pe;
(function(n) {
  n[n.Legacy = 0] = "Legacy", n[n.Strict = 1] = "Strict", n[n.Attribute = 2] = "Attribute";
})(Pe || (Pe = {}));
class t0 {
  constructor(e, t, r) {
    this.decodeTree = e, this.emitCodePoint = t, this.errors = r, this.state = U.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Pe.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(e) {
    this.decodeMode = e, this.state = U.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
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
      case U.EntityStart:
        return e.charCodeAt(t) === j.NUM ? (this.state = U.NumericStart, this.consumed += 1, this.stateNumericStart(e, t + 1)) : (this.state = U.NamedEntity, this.stateNamedEntity(e, t));
      case U.NumericStart:
        return this.stateNumericStart(e, t);
      case U.NumericDecimal:
        return this.stateNumericDecimal(e, t);
      case U.NumericHex:
        return this.stateNumericHex(e, t);
      case U.NamedEntity:
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
    return t >= e.length ? -1 : (e.charCodeAt(t) | Yh) === j.LOWER_X ? (this.state = U.NumericHex, this.consumed += 1, this.stateNumericHex(e, t + 1)) : (this.state = U.NumericDecimal, this.stateNumericDecimal(e, t));
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
      if (Bi(i) || Xh(i))
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
      if (Bi(i))
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
    if (e === j.SEMI)
      this.consumed += 1;
    else if (this.decodeMode === Pe.Strict)
      return 0;
    return this.emitCodePoint(Gh(this.result), this.consumed), this.errors && (e !== j.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
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
    let i = r[this.treeIndex], u = (i & et.VALUE_LENGTH) >> 14;
    for (; t < e.length; t++, this.excess++) {
      const s = e.charCodeAt(t);
      if (this.treeIndex = n0(r, i, this.treeIndex + Math.max(1, u), s), this.treeIndex < 0)
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === Pe.Attribute && // We shouldn't have consumed any characters after the entity,
        (u === 0 || // And there should be no invalid characters.
        e0(s)) ? 0 : this.emitNotTerminatedNamedEntity();
      if (i = r[this.treeIndex], u = (i & et.VALUE_LENGTH) >> 14, u !== 0) {
        if (s === j.SEMI)
          return this.emitNamedEntityData(this.treeIndex, u, this.consumed + this.excess);
        this.decodeMode !== Pe.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
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
    const { result: t, decodeTree: r } = this, i = (r[t] & et.VALUE_LENGTH) >> 14;
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
    return this.emitCodePoint(t === 1 ? i[e] & ~et.VALUE_LENGTH : i[e + 1], r), t === 3 && this.emitCodePoint(i[e + 2], r), r;
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
      case U.NamedEntity:
        return this.result !== 0 && (this.decodeMode !== Pe.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      // Otherwise, emit a numeric entity if we have one.
      case U.NumericDecimal:
        return this.emitNumericEntity(0, 2);
      case U.NumericHex:
        return this.emitNumericEntity(0, 3);
      case U.NumericStart:
        return (e = this.errors) === null || e === void 0 || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
      case U.EntityStart:
        return 0;
    }
  }
}
function Kl(n) {
  let e = "";
  const t = new t0(n, (r) => e += Zh(r));
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
function n0(n, e, t, r) {
  const i = (e & et.BRANCH_LENGTH) >> 7, u = e & et.JUMP_TABLE;
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
const Zl = Kl(jh);
Kl(Jh);
function r0(n, e = Pe.Legacy) {
  return Zl(n, e);
}
function i0(n) {
  return Zl(n, Pe.Strict);
}
function u0(n) {
  return Object.prototype.toString.call(n);
}
function yu(n) {
  return u0(n) === "[object String]";
}
const s0 = Object.prototype.hasOwnProperty;
function o0(n, e) {
  return s0.call(n, e);
}
function Vr(n) {
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
function Gl(n, e, t) {
  return [].concat(n.slice(0, e), t, n.slice(e + 1));
}
function ku(n) {
  return !(n >= 55296 && n <= 57343 || n >= 64976 && n <= 65007 || (n & 65535) === 65535 || (n & 65535) === 65534 || n >= 0 && n <= 8 || n === 11 || n >= 14 && n <= 31 || n >= 127 && n <= 159 || n > 1114111);
}
function An(n) {
  if (n > 65535) {
    n -= 65536;
    const e = 55296 + (n >> 10), t = 56320 + (n & 1023);
    return String.fromCharCode(e, t);
  }
  return String.fromCharCode(n);
}
const Yl = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, l0 = /&([a-z#][a-z0-9]{1,31});/gi, a0 = new RegExp(Yl.source + "|" + l0.source, "gi"), c0 = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function f0(n, e) {
  if (e.charCodeAt(0) === 35 && c0.test(e)) {
    const r = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return ku(r) ? An(r) : n;
  }
  const t = r0(n);
  return t !== n ? t : n;
}
function d0(n) {
  return n.indexOf("\\") < 0 ? n : n.replace(Yl, "$1");
}
function Kt(n) {
  return n.indexOf("\\") < 0 && n.indexOf("&") < 0 ? n : n.replace(a0, function(e, t, r) {
    return t || f0(e, r);
  });
}
const h0 = /[&<>"]/, p0 = /[&<>"]/g, m0 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function g0(n) {
  return m0[n];
}
function st(n) {
  return h0.test(n) ? n.replace(p0, g0) : n;
}
const b0 = /[.?*+^$[\]\\(){}|-]/g;
function x0(n) {
  return n.replace(b0, "\\$&");
}
function B(n) {
  switch (n) {
    case 9:
    case 32:
      return !0;
  }
  return !1;
}
function Mn(n) {
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
function Xl(n) {
  return xu.test(n) || jl.test(n);
}
function Tn(n) {
  return Xl(An(n));
}
function On(n) {
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
function qr(n) {
  return n = n.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (n = n.replace(/ẞ/g, "ß")), n.toLowerCase().toUpperCase();
}
function Us(n) {
  return n === 32 || n === 9 || n === 10 || n === 13;
}
function Hr(n) {
  let e = 0;
  for (; e < n.length && Us(n.charCodeAt(e)); e++)
    ;
  let t = n.length - 1;
  for (; t >= e && Us(n.charCodeAt(t)); t--)
    ;
  return n.slice(e, t + 1);
}
const y0 = { mdurl: Hh, ucmicro: Wh }, k0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayReplaceAt: Gl,
  asciiTrim: Hr,
  assign: Vr,
  escapeHtml: st,
  escapeRE: x0,
  fromCodePoint: An,
  has: o0,
  isMdAsciiPunct: On,
  isPunctChar: Xl,
  isPunctCharCode: Tn,
  isSpace: B,
  isString: yu,
  isValidEntityCode: ku,
  isWhiteSpace: Mn,
  lib: y0,
  normalizeReference: qr,
  unescapeAll: Kt,
  unescapeMd: d0
}, Symbol.toStringTag, { value: "Module" }));
function C0(n, e, t) {
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
function S0(n, e, t) {
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
        return u.pos = i + 1, u.str = Kt(n.slice(e + 1, i)), u.ok = !0, u;
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
  return e === i || s !== 0 || (u.str = Kt(n.slice(e, i)), u.pos = i, u.ok = !0), u;
}
function E0(n, e, t, r) {
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
      return s.pos = u + 1, s.str += Kt(n.slice(e, u)), s.ok = !0, s;
    if (i === 40 && s.marker === 41)
      return s;
    i === 92 && u + 1 < t && u++, u++;
  }
  return s.can_continue = !0, s.str += Kt(n.slice(e, u)), s;
}
const D0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseLinkDestination: S0,
  parseLinkLabel: C0,
  parseLinkTitle: E0
}, Symbol.toStringTag, { value: "Module" })), Me = {};
Me.code_inline = function(n, e, t, r, i) {
  const u = n[e];
  return "<code" + i.renderAttrs(u) + ">" + st(u.content) + "</code>";
};
Me.code_block = function(n, e, t, r, i) {
  const u = n[e];
  return "<pre" + i.renderAttrs(u) + "><code>" + st(n[e].content) + `</code></pre>
`;
};
Me.fence = function(n, e, t, r, i) {
  const u = n[e], s = u.info ? Kt(u.info).trim() : "";
  let o = "", l = "";
  if (s) {
    const c = s.split(/(\s+)/g);
    o = c[0], l = c.slice(2).join("");
  }
  let a;
  if (t.highlight ? a = t.highlight(u.content, o, l) || st(u.content) : a = st(u.content), a.indexOf("<pre") === 0)
    return a + `
`;
  if (s) {
    const c = u.attrIndex("class"), f = u.attrs ? u.attrs.slice() : [];
    c < 0 ? f.push(["class", t.langPrefix + o]) : (f[c] = f[c].slice(), f[c][1] += " " + t.langPrefix + o);
    const h = {
      attrs: f
    };
    return `<pre><code${i.renderAttrs(h)}>${a}</code></pre>
`;
  }
  return `<pre><code${i.renderAttrs(u)}>${a}</code></pre>
`;
};
Me.image = function(n, e, t, r, i) {
  const u = n[e];
  return u.attrs[u.attrIndex("alt")][1] = i.renderInlineAsText(u.children, t, r), i.renderToken(n, e, t);
};
Me.hardbreak = function(n, e, t) {
  return t.xhtmlOut ? `<br />
` : `<br>
`;
};
Me.softbreak = function(n, e, t) {
  return t.breaks ? t.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
Me.text = function(n, e) {
  return st(n[e].content);
};
Me.html_block = function(n, e) {
  return n[e].content;
};
Me.html_inline = function(n, e) {
  return n[e].content;
};
function Gt() {
  this.rules = Vr({}, Me);
}
Gt.prototype.renderAttrs = function(e) {
  let t, r, i;
  if (!e.attrs)
    return "";
  for (i = "", t = 0, r = e.attrs.length; t < r; t++)
    i += " " + st(e.attrs[t][0]) + '="' + st(e.attrs[t][1]) + '"';
  return i;
};
Gt.prototype.renderToken = function(e, t, r) {
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
Gt.prototype.renderInline = function(n, e, t) {
  let r = "";
  const i = this.rules;
  for (let u = 0, s = n.length; u < s; u++) {
    const o = n[u].type;
    typeof i[o] < "u" ? r += i[o](n, u, e, t, this) : r += this.renderToken(n, u, e);
  }
  return r;
};
Gt.prototype.renderInlineAsText = function(n, e, t) {
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
Gt.prototype.render = function(n, e, t) {
  let r = "";
  const i = this.rules;
  for (let u = 0, s = n.length; u < s; u++) {
    const o = n[u].type;
    o === "inline" ? r += this.renderInline(n[u].children, e, t) : typeof i[o] < "u" ? r += i[o](n, u, e, t, this) : r += this.renderToken(n, u, e, t);
  }
  return r;
};
function se() {
  this.__rules__ = [], this.__cache__ = null;
}
se.prototype.__find__ = function(n) {
  for (let e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === n)
      return e;
  return -1;
};
se.prototype.__compile__ = function() {
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
se.prototype.at = function(n, e, t) {
  const r = this.__find__(n), i = t || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__[r].fn = e, this.__rules__[r].alt = i.alt || [], this.__cache__ = null;
};
se.prototype.before = function(n, e, t, r) {
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
se.prototype.after = function(n, e, t, r) {
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
se.prototype.push = function(n, e, t) {
  const r = t || {};
  this.__rules__.push({
    name: n,
    enabled: !0,
    fn: e,
    alt: r.alt || []
  }), this.__cache__ = null;
};
se.prototype.enable = function(n, e) {
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
se.prototype.enableOnly = function(n, e) {
  Array.isArray(n) || (n = [n]), this.__rules__.forEach(function(t) {
    t.enabled = !1;
  }), this.enable(n, e);
};
se.prototype.disable = function(n, e) {
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
se.prototype.getRules = function(n) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[n] || [];
};
function ke(n, e, t) {
  this.type = n, this.tag = e, this.attrs = null, this.map = null, this.nesting = t, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
ke.prototype.attrIndex = function(e) {
  if (!this.attrs)
    return -1;
  const t = this.attrs;
  for (let r = 0, i = t.length; r < i; r++)
    if (t[r][0] === e)
      return r;
  return -1;
};
ke.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
ke.prototype.attrSet = function(e, t) {
  const r = this.attrIndex(e), i = [e, t];
  r < 0 ? this.attrPush(i) : this.attrs[r] = i;
};
ke.prototype.attrGet = function(e) {
  const t = this.attrIndex(e);
  let r = null;
  return t >= 0 && (r = this.attrs[t][1]), r;
};
ke.prototype.attrJoin = function(e, t) {
  const r = this.attrIndex(e);
  r < 0 ? this.attrPush([e, t]) : this.attrs[r][1] = this.attrs[r][1] + " " + t;
};
function Ql(n, e, t) {
  this.src = n, this.env = t, this.tokens = [], this.inlineMode = !1, this.md = e;
}
Ql.prototype.Token = ke;
const w0 = /\r\n?|\n/g, _0 = /\0/g;
function A0(n) {
  let e;
  e = n.src.replace(w0, `
`), e = e.replace(_0, "�"), n.src = e;
}
function M0(n) {
  let e;
  n.inlineMode ? (e = new n.Token("inline", "", 0), e.content = n.src, e.map = [0, 1], e.children = [], n.tokens.push(e)) : n.md.block.parse(n.src, n.md, n.env, n.tokens);
}
function T0(n) {
  const e = n.tokens;
  for (let t = 0, r = e.length; t < r; t++) {
    const i = e[t];
    i.type === "inline" && n.md.inline.parse(i.content, n.md, n.env, i.children);
  }
}
function O0(n) {
  return /^<a[>\s]/i.test(n);
}
function N0(n) {
  return /^<\/a\s*>/i.test(n);
}
function F0(n) {
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
        if (o.type === "html_inline" && (O0(o.content) && u > 0 && u--, N0(o.content) && u++), !(u > 0) && o.type === "text" && n.md.linkify.test(o.content)) {
          const l = o.content;
          let a = n.md.linkify.match(l);
          const c = [];
          let f = o.level, h = 0;
          a.length > 0 && a[0].index === 0 && s > 0 && i[s - 1].type === "text_special" && (a = a.slice(1));
          for (let p = 0; p < a.length; p++) {
            const d = a[p].url, m = n.md.normalizeLink(d);
            if (!n.md.validateLink(m))
              continue;
            let g = a[p].text;
            a[p].schema ? a[p].schema === "mailto:" && !/^mailto:/i.test(g) ? g = n.md.normalizeLinkText("mailto:" + g).replace(/^mailto:/, "") : g = n.md.normalizeLinkText(g) : g = n.md.normalizeLinkText("http://" + g).replace(/^http:\/\//, "");
            const y = a[p].index;
            if (y > h) {
              const M = new n.Token("text", "", 0);
              M.content = l.slice(h, y), M.level = f, c.push(M);
            }
            const E = new n.Token("link_open", "a", 1);
            E.attrs = [["href", m]], E.level = f++, E.markup = "linkify", E.info = "auto", c.push(E);
            const D = new n.Token("text", "", 0);
            D.content = g, D.level = f, c.push(D);
            const A = new n.Token("link_close", "a", -1);
            A.level = --f, A.markup = "linkify", A.info = "auto", c.push(A), h = a[p].lastIndex;
          }
          if (h < l.length) {
            const p = new n.Token("text", "", 0);
            p.content = l.slice(h), p.level = f, c.push(p);
          }
          e[t].children = i = Gl(i, s, c);
        }
      }
    }
}
const ea = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, v0 = /\((c|tm|r)\)/i, I0 = /\((c|tm|r)\)/ig, R0 = {
  c: "©",
  r: "®",
  tm: "™"
};
function P0(n, e) {
  return R0[e.toLowerCase()];
}
function $0(n) {
  let e = 0;
  for (let t = n.length - 1; t >= 0; t--) {
    const r = n[t];
    r.type === "text" && !e && (r.content = r.content.replace(I0, P0)), r.type === "link_open" && r.info === "auto" && e--, r.type === "link_close" && r.info === "auto" && e++;
  }
}
function z0(n) {
  let e = 0;
  for (let t = n.length - 1; t >= 0; t--) {
    const r = n[t];
    r.type === "text" && !e && ea.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), r.type === "link_open" && r.info === "auto" && e--, r.type === "link_close" && r.info === "auto" && e++;
  }
}
function B0(n) {
  let e;
  if (n.md.options.typographer)
    for (e = n.tokens.length - 1; e >= 0; e--)
      n.tokens[e].type === "inline" && (v0.test(n.tokens[e].content) && $0(n.tokens[e].children), ea.test(n.tokens[e].content) && z0(n.tokens[e].children));
}
const L0 = /['"]/, Ws = /['"]/g, js = "’";
function sr(n, e, t, r) {
  n[e] || (n[e] = []), n[e].push({ pos: t, ch: r });
}
function V0(n, e) {
  let t = "", r = 0;
  e.sort((i, u) => i.pos - u.pos);
  for (let i = 0; i < e.length; i++) {
    const u = e[i];
    t += n.slice(r, u.pos) + u.ch, r = u.pos + 1;
  }
  return t + n.slice(r);
}
function q0(n, e) {
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
        Ws.lastIndex = a;
        const f = Ws.exec(l);
        if (!f)
          break;
        let h = !0, p = !0;
        a = f.index + 1;
        const d = f[0] === "'";
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
        const y = On(m) || Tn(m), E = On(g) || Tn(g), D = Mn(m), A = Mn(g);
        if (A ? h = !1 : E && (D || y || (h = !1)), D ? p = !1 : y && (A || E || (p = !1)), g === 34 && f[0] === '"' && m >= 48 && m <= 57 && (p = h = !1), h && p && (h = y, p = E), !h && !p) {
          d && sr(i, u, f.index, js);
          continue;
        }
        if (p)
          for (t = r.length - 1; t >= 0; t--) {
            let M = r[t];
            if (r[t].level < o)
              break;
            if (M.single === d && r[t].level === o) {
              M = r[t];
              let F, _;
              d ? (F = e.md.options.quotes[2], _ = e.md.options.quotes[3]) : (F = e.md.options.quotes[0], _ = e.md.options.quotes[1]), sr(i, u, f.index, _), sr(i, M.token, M.pos, F), r.length = t;
              continue e;
            }
          }
        h ? r.push({
          token: u,
          pos: f.index,
          single: d,
          level: o
        }) : p && d && sr(i, u, f.index, js);
      }
  }
  Object.keys(i).forEach(function(u) {
    n[u].content = V0(n[u].content, i[u]);
  });
}
function H0(n) {
  if (n.md.options.typographer)
    for (let e = n.tokens.length - 1; e >= 0; e--)
      n.tokens[e].type !== "inline" || !L0.test(n.tokens[e].content) || q0(n.tokens[e].children, n);
}
function U0(n) {
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
const pi = [
  ["normalize", A0],
  ["block", M0],
  ["inline", T0],
  ["linkify", F0],
  ["replacements", B0],
  ["smartquotes", H0],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", U0]
];
function Cu() {
  this.ruler = new se();
  for (let n = 0; n < pi.length; n++)
    this.ruler.push(pi[n][0], pi[n][1]);
}
Cu.prototype.process = function(n) {
  const e = this.ruler.getRules("");
  for (let t = 0, r = e.length; t < r; t++)
    e[t](n);
};
Cu.prototype.State = Ql;
function Te(n, e, t, r) {
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
Te.prototype.push = function(n, e, t) {
  const r = new ke(n, e, t);
  return r.block = !0, t < 0 && this.level--, r.level = this.level, t > 0 && this.level++, this.tokens.push(r), r;
};
Te.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
Te.prototype.skipEmptyLines = function(e) {
  for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
Te.prototype.skipSpaces = function(e) {
  for (let t = this.src.length; e < t; e++) {
    const r = this.src.charCodeAt(e);
    if (!B(r))
      break;
  }
  return e;
};
Te.prototype.skipSpacesBack = function(e, t) {
  if (e <= t)
    return e;
  for (; e > t; )
    if (!B(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
Te.prototype.skipChars = function(e, t) {
  for (let r = this.src.length; e < r && this.src.charCodeAt(e) === t; e++)
    ;
  return e;
};
Te.prototype.skipCharsBack = function(e, t, r) {
  if (e <= r)
    return e;
  for (; e > r; )
    if (t !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
Te.prototype.getLines = function(e, t, r, i) {
  if (e >= t)
    return "";
  const u = new Array(t - e);
  for (let s = 0, o = e; o < t; o++, s++) {
    let l = 0;
    const a = this.bMarks[o];
    let c = a, f;
    for (o + 1 < t || i ? f = this.eMarks[o] + 1 : f = this.eMarks[o]; c < f && l < r; ) {
      const h = this.src.charCodeAt(c);
      if (B(h))
        h === 9 ? l += 4 - (l + this.bsCount[o]) % 4 : l++;
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
Te.prototype.Token = ke;
const W0 = 65536;
function mi(n, e) {
  const t = n.bMarks[e] + n.tShift[e], r = n.eMarks[e];
  return n.src.slice(t, r);
}
function Js(n) {
  const e = [], t = n.length;
  let r = 0, i = n.charCodeAt(r), u = !1, s = 0, o = "";
  for (; r < t; )
    i === 124 && (u ? (o += n.substring(s, r - 1), s = r) : (e.push(o + n.substring(s, r)), o = "", s = r + 1)), u = i === 92, r++, i = n.charCodeAt(r);
  return e.push(o + n.substring(s)), e;
}
function j0(n, e, t, r) {
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
  let l = mi(n, e + 1), a = l.split("|");
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
  if (l = mi(n, e).trim(), l.indexOf("|") === -1 || n.sCount[e] - n.blkIndent >= 4)
    return !1;
  a = Js(l), a.length && a[0] === "" && a.shift(), a.length && a[a.length - 1] === "" && a.pop();
  const f = a.length;
  if (f === 0 || f !== c.length)
    return !1;
  if (r)
    return !0;
  const h = n.parentType;
  n.parentType = "table";
  const p = n.md.block.ruler.getRules("blockquote"), d = n.push("table_open", "table", 1), m = [e, 0];
  d.map = m;
  const g = n.push("thead_open", "thead", 1);
  g.map = [e, e + 1];
  const y = n.push("tr_open", "tr", 1);
  y.map = [e, e + 1];
  for (let A = 0; A < a.length; A++) {
    const M = n.push("th_open", "th", 1);
    c[A] && (M.attrs = [["style", "text-align:" + c[A]]]);
    const F = n.push("inline", "", 0);
    F.content = a[A].trim(), F.children = [], n.push("th_close", "th", -1);
  }
  n.push("tr_close", "tr", -1), n.push("thead_close", "thead", -1);
  let E, D = 0;
  for (i = e + 2; i < t && !(n.sCount[i] < n.blkIndent); i++) {
    let A = !1;
    for (let F = 0, _ = p.length; F < _; F++)
      if (p[F](n, i, t, !0)) {
        A = !0;
        break;
      }
    if (A || (l = mi(n, i).trim(), !l) || n.sCount[i] - n.blkIndent >= 4 || (a = Js(l), a.length && a[0] === "" && a.shift(), a.length && a[a.length - 1] === "" && a.pop(), D += f - a.length, D > W0))
      break;
    if (i === e + 2) {
      const F = n.push("tbody_open", "tbody", 1);
      F.map = E = [e + 2, 0];
    }
    const M = n.push("tr_open", "tr", 1);
    M.map = [i, i + 1];
    for (let F = 0; F < f; F++) {
      const _ = n.push("td_open", "td", 1);
      c[F] && (_.attrs = [["style", "text-align:" + c[F]]]);
      const v = n.push("inline", "", 0);
      v.content = a[F] ? a[F].trim() : "", v.children = [], n.push("td_close", "td", -1);
    }
    n.push("tr_close", "tr", -1);
  }
  return E && (n.push("tbody_close", "tbody", -1), E[1] = i), n.push("table_close", "table", -1), m[1] = i, n.parentType = h, n.line = i, !0;
}
function J0(n, e, t) {
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
function K0(n, e, t, r) {
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
  let f = e, h = !1;
  for (; f++, !(f >= t || (i = o = n.bMarks[f] + n.tShift[f], u = n.eMarks[f], i < u && n.sCount[f] < n.blkIndent)); )
    if (n.src.charCodeAt(i) === s && !(n.sCount[f] - n.blkIndent >= 4) && (i = n.skipChars(i, s), !(i - o < l) && (i = n.skipSpaces(i), !(i < u)))) {
      h = !0;
      break;
    }
  l = n.sCount[e], n.line = f + (h ? 1 : 0);
  const p = n.push("fence", "code", 0);
  return p.info = c, p.content = n.getLines(e + 1, f, l, !0), p.markup = a, p.map = [e, n.line], !0;
}
function Z0(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e];
  const s = n.lineMax;
  if (n.sCount[e] - n.blkIndent >= 4 || n.src.charCodeAt(i) !== 62)
    return !1;
  if (r)
    return !0;
  const o = [], l = [], a = [], c = [], f = n.md.block.ruler.getRules("blockquote"), h = n.parentType;
  n.parentType = "blockquote";
  let p = !1, d;
  for (d = e; d < t; d++) {
    const D = n.sCount[d] < n.blkIndent;
    if (i = n.bMarks[d] + n.tShift[d], u = n.eMarks[d], i >= u)
      break;
    if (n.src.charCodeAt(i++) === 62 && !D) {
      let M = n.sCount[d] + 1, F, _;
      n.src.charCodeAt(i) === 32 ? (i++, M++, _ = !1, F = !0) : n.src.charCodeAt(i) === 9 ? (F = !0, (n.bsCount[d] + M) % 4 === 3 ? (i++, M++, _ = !1) : _ = !0) : F = !1;
      let v = M;
      for (o.push(n.bMarks[d]), n.bMarks[d] = i; i < u; ) {
        const T = n.src.charCodeAt(i);
        if (B(T))
          T === 9 ? v += 4 - (v + n.bsCount[d] + (_ ? 1 : 0)) % 4 : v++;
        else
          break;
        i++;
      }
      p = i >= u, l.push(n.bsCount[d]), n.bsCount[d] = n.sCount[d] + 1 + (F ? 1 : 0), a.push(n.sCount[d]), n.sCount[d] = v - M, c.push(n.tShift[d]), n.tShift[d] = i - n.bMarks[d];
      continue;
    }
    if (p)
      break;
    let A = !1;
    for (let M = 0, F = f.length; M < F; M++)
      if (f[M](n, d, t, !0)) {
        A = !0;
        break;
      }
    if (A) {
      n.lineMax = d, n.blkIndent !== 0 && (o.push(n.bMarks[d]), l.push(n.bsCount[d]), c.push(n.tShift[d]), a.push(n.sCount[d]), n.sCount[d] -= n.blkIndent);
      break;
    }
    o.push(n.bMarks[d]), l.push(n.bsCount[d]), c.push(n.tShift[d]), a.push(n.sCount[d]), n.sCount[d] = -1;
  }
  const m = n.blkIndent;
  n.blkIndent = 0;
  const g = n.push("blockquote_open", "blockquote", 1);
  g.markup = ">";
  const y = [e, 0];
  g.map = y, n.md.block.tokenize(n, e, d);
  const E = n.push("blockquote_close", "blockquote", -1);
  E.markup = ">", n.lineMax = s, n.parentType = h, y[1] = n.line;
  for (let D = 0; D < c.length; D++)
    n.bMarks[D + e] = o[D], n.tShift[D + e] = c[D], n.sCount[D + e] = a[D], n.bsCount[D + e] = l[D];
  return n.blkIndent = m, !0;
}
function G0(n, e, t, r) {
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
function Ks(n, e) {
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
function Zs(n, e) {
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
function Y0(n, e) {
  const t = n.level + 2;
  for (let r = e + 2, i = n.tokens.length - 2; r < i; r++)
    n.tokens[r].level === t && n.tokens[r].type === "paragraph_open" && (n.tokens[r + 2].hidden = !0, n.tokens[r].hidden = !0, r += 2);
}
function X0(n, e, t, r) {
  let i, u, s, o, l = e, a = !0;
  if (n.sCount[l] - n.blkIndent >= 4 || n.listIndent >= 0 && n.sCount[l] - n.listIndent >= 4 && n.sCount[l] < n.blkIndent)
    return !1;
  let c = !1;
  r && n.parentType === "paragraph" && n.sCount[l] >= n.blkIndent && (c = !0);
  let f, h, p;
  if ((p = Zs(n, l)) >= 0) {
    if (f = !0, s = n.bMarks[l] + n.tShift[l], h = Number(n.src.slice(s, p - 1)), c && h !== 1) return !1;
  } else if ((p = Ks(n, l)) >= 0)
    f = !1;
  else
    return !1;
  if (c && n.skipSpaces(p) >= n.eMarks[l])
    return !1;
  if (r)
    return !0;
  const d = n.src.charCodeAt(p - 1), m = n.tokens.length;
  f ? (o = n.push("ordered_list_open", "ol", 1), h !== 1 && (o.attrs = [["start", h]])) : o = n.push("bullet_list_open", "ul", 1);
  const g = [l, 0];
  o.map = g, o.markup = String.fromCharCode(d);
  let y = !1;
  const E = n.md.block.ruler.getRules("list"), D = n.parentType;
  for (n.parentType = "list"; l < t; ) {
    u = p, i = n.eMarks[l];
    const A = n.sCount[l] + p - (n.bMarks[l] + n.tShift[l]);
    let M = A;
    for (; u < i; ) {
      const Le = n.src.charCodeAt(u);
      if (Le === 9)
        M += 4 - (M + n.bsCount[l]) % 4;
      else if (Le === 32)
        M++;
      else
        break;
      u++;
    }
    const F = u;
    let _;
    F >= i ? _ = 1 : _ = M - A, _ > 4 && (_ = 1);
    const v = A + _;
    o = n.push("list_item_open", "li", 1), o.markup = String.fromCharCode(d);
    const T = [l, 0];
    o.map = T, f && (o.info = n.src.slice(s, p - 1));
    const H = n.tight, Oe = n.tShift[l], lt = n.sCount[l], at = n.listIndent;
    if (n.listIndent = n.blkIndent, n.blkIndent = v, n.tight = !0, n.tShift[l] = F - n.bMarks[l], n.sCount[l] = M, F >= i && n.isEmpty(l + 1) ? n.line = Math.min(n.line + 2, t) : n.md.block.tokenize(n, l, t, !0), (!n.tight || y) && (a = !1), y = n.line - l > 1 && n.isEmpty(n.line - 1), n.blkIndent = n.listIndent, n.listIndent = at, n.tShift[l] = Oe, n.sCount[l] = lt, n.tight = H, o = n.push("list_item_close", "li", -1), o.markup = String.fromCharCode(d), l = n.line, T[1] = l, l >= t || n.sCount[l] < n.blkIndent || n.sCount[l] - n.blkIndent >= 4)
      break;
    let At = !1;
    for (let Le = 0, Va = E.length; Le < Va; Le++)
      if (E[Le](n, l, t, !0)) {
        At = !0;
        break;
      }
    if (At)
      break;
    if (f) {
      if (p = Zs(n, l), p < 0)
        break;
      s = n.bMarks[l] + n.tShift[l];
    } else if (p = Ks(n, l), p < 0)
      break;
    if (d !== n.src.charCodeAt(p - 1))
      break;
  }
  return f ? o = n.push("ordered_list_close", "ol", -1) : o = n.push("bullet_list_close", "ul", -1), o.markup = String.fromCharCode(d), g[1] = l, n.line = l, n.parentType = D, a && Y0(n, m), !0;
}
function Q0(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e], s = e + 1;
  if (n.sCount[e] - n.blkIndent >= 4 || n.src.charCodeAt(i) !== 91)
    return !1;
  function o(E) {
    const D = n.lineMax;
    if (E >= D || n.isEmpty(E))
      return null;
    let A = !1;
    if (n.sCount[E] - n.blkIndent > 3 && (A = !0), n.sCount[E] < 0 && (A = !0), !A) {
      const _ = n.md.block.ruler.getRules("reference"), v = n.parentType;
      n.parentType = "reference";
      let T = !1;
      for (let H = 0, Oe = _.length; H < Oe; H++)
        if (_[H](n, E, D, !0)) {
          T = !0;
          break;
        }
      if (n.parentType = v, T)
        return null;
    }
    const M = n.bMarks[E] + n.tShift[E], F = n.eMarks[E];
    return n.src.slice(M, F + 1);
  }
  let l = n.src.slice(i, u + 1);
  u = l.length;
  let a = -1;
  for (i = 1; i < u; i++) {
    const E = l.charCodeAt(i);
    if (E === 91)
      return !1;
    if (E === 93) {
      a = i;
      break;
    } else if (E === 10) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    } else if (E === 92 && (i++, i < u && l.charCodeAt(i) === 10)) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    }
  }
  if (a < 0 || l.charCodeAt(a + 1) !== 58)
    return !1;
  for (i = a + 2; i < u; i++) {
    const E = l.charCodeAt(i);
    if (E === 10) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    } else if (!B(E)) break;
  }
  const c = n.md.helpers.parseLinkDestination(l, i, u);
  if (!c.ok)
    return !1;
  const f = n.md.normalizeLink(c.str);
  if (!n.md.validateLink(f))
    return !1;
  i = c.pos;
  const h = i, p = s, d = i;
  for (; i < u; i++) {
    const E = l.charCodeAt(i);
    if (E === 10) {
      const D = o(s);
      D !== null && (l += D, u = l.length, s++);
    } else if (!B(E)) break;
  }
  let m = n.md.helpers.parseLinkTitle(l, i, u);
  for (; m.can_continue; ) {
    const E = o(s);
    if (E === null) break;
    l += E, i = u, u = l.length, s++, m = n.md.helpers.parseLinkTitle(l, i, u, m);
  }
  let g;
  for (i < u && d !== i && m.ok ? (g = m.str, i = m.pos) : (g = "", i = h, s = p); i < u; ) {
    const E = l.charCodeAt(i);
    if (!B(E))
      break;
    i++;
  }
  if (i < u && l.charCodeAt(i) !== 10 && g)
    for (g = "", i = h, s = p; i < u; ) {
      const E = l.charCodeAt(i);
      if (!B(E))
        break;
      i++;
    }
  if (i < u && l.charCodeAt(i) !== 10)
    return !1;
  const y = qr(l.slice(1, a));
  return y ? (r || (typeof n.env.references > "u" && (n.env.references = {}), typeof n.env.references[y] > "u" && (n.env.references[y] = { title: g, href: f }), n.line = s), !0) : !1;
}
const ep = [
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
], tp = "[a-zA-Z_:][a-zA-Z0-9:._-]*", np = "[^\"'=<>`\\x00-\\x20]+", rp = "'[^']*'", ip = '"[^"]*"', up = "(?:" + np + "|" + rp + "|" + ip + ")", sp = "(?:\\s+" + tp + "(?:\\s*=\\s*" + up + ")?)", ta = "<[A-Za-z][A-Za-z0-9\\-]*" + sp + "*\\s*\\/?>", na = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", op = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->", lp = "<[?][\\s\\S]*?[?]>", ap = "<![A-Za-z][^>]*>", cp = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", fp = new RegExp("^(?:" + ta + "|" + na + "|" + op + "|" + lp + "|" + ap + "|" + cp + ")"), dp = new RegExp("^(?:" + ta + "|" + na + ")"), ft = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + ep.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(dp.source + "\\s*$"), /^$/, !1]
];
function hp(n, e, t, r) {
  let i = n.bMarks[e] + n.tShift[e], u = n.eMarks[e];
  if (n.sCount[e] - n.blkIndent >= 4 || !n.md.options.html || n.src.charCodeAt(i) !== 60)
    return !1;
  let s = n.src.slice(i, u), o = 0;
  for (; o < ft.length && !ft[o][0].test(s); o++)
    ;
  if (o === ft.length)
    return !1;
  if (r)
    return ft[o][2];
  let l = e + 1;
  const a = ft[o][1].test("");
  if (!ft[o][1].test(s)) {
    for (; l < t && !(n.sCount[l] < n.blkIndent && (a || !n.isEmpty(l))); l++)
      if (i = n.bMarks[l] + n.tShift[l], u = n.eMarks[l], s = n.src.slice(i, u), ft[o][1].test(s)) {
        s.length !== 0 && l++;
        break;
      }
  }
  n.line = l;
  const c = n.push("html_block", "", 0);
  return c.map = [e, l], c.content = n.getLines(e, l, n.blkIndent, !0), !0;
}
function pp(n, e, t, r) {
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
  c.content = Hr(n.src.slice(i, u)), c.map = [e, n.line], c.children = [];
  const f = n.push("heading_close", "h" + String(o), -1);
  return f.markup = "########".slice(0, o), !0;
}
function mp(n, e, t) {
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
      const d = n.eMarks[o];
      if (p < d && (s = n.src.charCodeAt(p), (s === 45 || s === 61) && (p = n.skipChars(p, s), p = n.skipSpaces(p), p >= d))) {
        u = s === 61 ? 1 : 2;
        break;
      }
    }
    if (n.sCount[o] < 0)
      continue;
    let h = !1;
    for (let p = 0, d = r.length; p < d; p++)
      if (r[p](n, o, t, !0)) {
        h = !0;
        break;
      }
    if (h)
      break;
  }
  if (!u)
    return n.parentType = i, !1;
  const l = Hr(n.getLines(e, o, n.blkIndent, !1));
  n.line = o + 1;
  const a = n.push("heading_open", "h" + String(u), 1);
  a.markup = String.fromCharCode(s), a.map = [e, n.line];
  const c = n.push("inline", "", 0);
  c.content = l, c.map = [e, n.line - 1], c.children = [];
  const f = n.push("heading_close", "h" + String(u), -1);
  return f.markup = String.fromCharCode(s), n.parentType = i, !0;
}
function gp(n, e, t) {
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
  const s = Hr(n.getLines(e, u, n.blkIndent, !1));
  n.line = u;
  const o = n.push("paragraph_open", "p", 1);
  o.map = [e, n.line];
  const l = n.push("inline", "", 0);
  return l.content = s, l.map = [e, n.line], l.children = [], n.push("paragraph_close", "p", -1), n.parentType = i, !0;
}
const or = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", j0, ["paragraph", "reference"]],
  ["code", J0],
  ["fence", K0, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", Z0, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", G0, ["paragraph", "reference", "blockquote", "list"]],
  ["list", X0, ["paragraph", "reference", "blockquote"]],
  ["reference", Q0],
  ["html_block", hp, ["paragraph", "reference", "blockquote"]],
  ["heading", pp, ["paragraph", "reference", "blockquote"]],
  ["lheading", mp],
  ["paragraph", gp]
];
function Ur() {
  this.ruler = new se();
  for (let n = 0; n < or.length; n++)
    this.ruler.push(or[n][0], or[n][1], { alt: (or[n][2] || []).slice() });
}
Ur.prototype.tokenize = function(n, e, t) {
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
Ur.prototype.parse = function(n, e, t, r) {
  if (!n)
    return;
  const i = new this.State(n, e, t, r);
  this.tokenize(i, i.line, i.lineMax);
};
Ur.prototype.State = Te;
function Qn(n, e, t, r) {
  this.src = n, this.env = t, this.md = e, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
Qn.prototype.pushPending = function() {
  const n = new ke("text", "", 0);
  return n.content = this.pending, n.level = this.pendingLevel, this.tokens.push(n), this.pending = "", n;
};
Qn.prototype.push = function(n, e, t) {
  this.pending && this.pushPending();
  const r = new ke(n, e, t);
  let i = null;
  return t < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, t > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
};
Qn.prototype.scanDelims = function(n, e) {
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
  const l = On(i) || Tn(i), a = On(o) || Tn(o), c = Mn(i), f = Mn(o), h = !f && (!a || c || l), p = !c && (!l || f || a);
  return { can_open: h && (e || !p || l), can_close: p && (e || !h || a), length: s };
};
Qn.prototype.Token = ke;
function bp(n) {
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
function xp(n, e) {
  let t = n.pos;
  for (; t < n.posMax && !bp(n.src.charCodeAt(t)); )
    t++;
  return t === n.pos ? !1 : (e || (n.pending += n.src.slice(n.pos, t)), n.pos = t, !0);
}
const yp = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function kp(n, e) {
  if (!n.md.options.linkify || n.linkLevel > 0) return !1;
  const t = n.pos, r = n.posMax;
  if (t + 3 > r || n.src.charCodeAt(t) !== 58 || n.src.charCodeAt(t + 1) !== 47 || n.src.charCodeAt(t + 2) !== 47) return !1;
  const i = n.pending.match(yp);
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
    const h = n.push("link_close", "a", -1);
    h.markup = "linkify", h.info = "auto";
  }
  return n.pos += o.length - u.length, !0;
}
function Cp(n, e) {
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
const Su = [];
for (let n = 0; n < 256; n++)
  Su.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(n) {
  Su[n.charCodeAt(0)] = 1;
});
function Sp(n, e) {
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
    i < 256 && Su[i] !== 0 ? o.content = u : o.content = s, o.markup = s, o.info = "escape";
  }
  return n.pos = t + 1, !0;
}
function Ep(n, e) {
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
function Dp(n, e) {
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
function Gs(n, e) {
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
function wp(n) {
  const e = n.tokens_meta, t = n.tokens_meta.length;
  Gs(n, n.delimiters);
  for (let r = 0; r < t; r++)
    e[r] && e[r].delimiters && Gs(n, e[r].delimiters);
}
const ra = {
  tokenize: Dp,
  postProcess: wp
};
function _p(n, e) {
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
function Ys(n, e) {
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
function Ap(n) {
  const e = n.tokens_meta, t = n.tokens_meta.length;
  Ys(n, n.delimiters);
  for (let r = 0; r < t; r++)
    e[r] && e[r].delimiters && Ys(n, e[r].delimiters);
}
const ia = {
  tokenize: _p,
  postProcess: Ap
};
function Mp(n, e) {
  let t, r, i, u, s = "", o = "", l = n.pos, a = !0;
  if (n.src.charCodeAt(n.pos) !== 91)
    return !1;
  const c = n.pos, f = n.posMax, h = n.pos + 1, p = n.md.helpers.parseLinkLabel(n, n.pos, !0);
  if (p < 0)
    return !1;
  let d = p + 1;
  if (d < f && n.src.charCodeAt(d) === 40) {
    for (a = !1, d++; d < f && (t = n.src.charCodeAt(d), !(!B(t) && t !== 10)); d++)
      ;
    if (d >= f)
      return !1;
    if (l = d, i = n.md.helpers.parseLinkDestination(n.src, d, n.posMax), i.ok) {
      for (s = n.md.normalizeLink(i.str), n.md.validateLink(s) ? d = i.pos : s = "", l = d; d < f && (t = n.src.charCodeAt(d), !(!B(t) && t !== 10)); d++)
        ;
      if (i = n.md.helpers.parseLinkTitle(n.src, d, n.posMax), d < f && l !== d && i.ok)
        for (o = i.str, d = i.pos; d < f && (t = n.src.charCodeAt(d), !(!B(t) && t !== 10)); d++)
          ;
    }
    (d >= f || n.src.charCodeAt(d) !== 41) && (a = !0), d++;
  }
  if (a) {
    if (typeof n.env.references > "u")
      return !1;
    if (d < f && n.src.charCodeAt(d) === 91 ? (l = d + 1, d = n.md.helpers.parseLinkLabel(n, d), d >= 0 ? r = n.src.slice(l, d++) : d = p + 1) : d = p + 1, r || (r = n.src.slice(h, p)), u = n.env.references[qr(r)], !u)
      return n.pos = c, !1;
    s = u.href, o = u.title;
  }
  if (!e) {
    n.pos = h, n.posMax = p;
    const m = n.push("link_open", "a", 1), g = [["href", s]];
    m.attrs = g, o && g.push(["title", o]), n.linkLevel++, n.md.inline.tokenize(n), n.linkLevel--, n.push("link_close", "a", -1);
  }
  return n.pos = d, n.posMax = f, !0;
}
function Tp(n, e) {
  let t, r, i, u, s, o, l, a, c = "";
  const f = n.pos, h = n.posMax;
  if (n.src.charCodeAt(n.pos) !== 33 || n.src.charCodeAt(n.pos + 1) !== 91)
    return !1;
  const p = n.pos + 2, d = n.md.helpers.parseLinkLabel(n, n.pos + 1, !1);
  if (d < 0)
    return !1;
  if (u = d + 1, u < h && n.src.charCodeAt(u) === 40) {
    for (u++; u < h && (t = n.src.charCodeAt(u), !(!B(t) && t !== 10)); u++)
      ;
    if (u >= h)
      return !1;
    for (a = u, o = n.md.helpers.parseLinkDestination(n.src, u, n.posMax), o.ok && (c = n.md.normalizeLink(o.str), n.md.validateLink(c) ? u = o.pos : c = ""), a = u; u < h && (t = n.src.charCodeAt(u), !(!B(t) && t !== 10)); u++)
      ;
    if (o = n.md.helpers.parseLinkTitle(n.src, u, n.posMax), u < h && a !== u && o.ok)
      for (l = o.str, u = o.pos; u < h && (t = n.src.charCodeAt(u), !(!B(t) && t !== 10)); u++)
        ;
    else
      l = "";
    if (u >= h || n.src.charCodeAt(u) !== 41)
      return n.pos = f, !1;
    u++;
  } else {
    if (typeof n.env.references > "u")
      return !1;
    if (u < h && n.src.charCodeAt(u) === 91 ? (a = u + 1, u = n.md.helpers.parseLinkLabel(n, u), u >= 0 ? i = n.src.slice(a, u++) : u = d + 1) : u = d + 1, i || (i = n.src.slice(p, d)), s = n.env.references[qr(i)], !s)
      return n.pos = f, !1;
    c = s.href, l = s.title;
  }
  if (!e) {
    r = n.src.slice(p, d);
    const m = [];
    n.md.inline.parse(
      r,
      n.md,
      n.env,
      m
    );
    const g = n.push("image", "img", 0), y = [["src", c], ["alt", ""]];
    g.attrs = y, g.children = m, g.content = r, l && y.push(["title", l]);
  }
  return n.pos = u, n.posMax = h, !0;
}
const Op = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Np = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Fp(n, e) {
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
  if (Np.test(u)) {
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
  if (Op.test(u)) {
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
function vp(n) {
  return /^<a[>\s]/i.test(n);
}
function Ip(n) {
  return /^<\/a\s*>/i.test(n);
}
function Rp(n) {
  const e = n | 32;
  return e >= 97 && e <= 122;
}
function Pp(n, e) {
  if (!n.md.options.html)
    return !1;
  const t = n.posMax, r = n.pos;
  if (n.src.charCodeAt(r) !== 60 || r + 2 >= t)
    return !1;
  const i = n.src.charCodeAt(r + 1);
  if (i !== 33 && i !== 63 && i !== 47 && !Rp(i))
    return !1;
  const u = n.src.slice(r).match(fp);
  if (!u)
    return !1;
  if (!e) {
    const s = n.push("html_inline", "", 0);
    s.content = u[0], vp(s.content) && n.linkLevel++, Ip(s.content) && n.linkLevel--;
  }
  return n.pos += u[0].length, !0;
}
const $p = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, zp = /^&([a-z][a-z0-9]{1,31});/i;
function Bp(n, e) {
  const t = n.pos, r = n.posMax;
  if (n.src.charCodeAt(t) !== 38 || t + 1 >= r) return !1;
  if (n.src.charCodeAt(t + 1) === 35) {
    const u = n.src.slice(t).match($p);
    if (u) {
      if (!e) {
        const s = u[1][0].toLowerCase() === "x" ? parseInt(u[1].slice(1), 16) : parseInt(u[1], 10), o = n.push("text_special", "", 0);
        o.content = ku(s) ? An(s) : An(65533), o.markup = u[0], o.info = "entity";
      }
      return n.pos += u[0].length, !0;
    }
  } else {
    const u = n.src.slice(t).match(zp);
    if (u) {
      const s = i0(u[0]);
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
function Xs(n) {
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
        let h = !1;
        if ((f.close || o.open) && (f.length + o.length) % 3 === 0 && (f.length % 3 !== 0 || o.length % 3 !== 0) && (h = !0), !h) {
          const p = a > 0 && !n[a - 1].open ? u[a - 1] + 1 : 0;
          u[s] = s - a + p, u[a] = p, o.open = !1, f.end = s, f.close = !1, c = -1, i = -2;
          break;
        }
      }
    }
    c !== -1 && (e[o.marker][(o.open ? 3 : 0) + (o.length || 0) % 3] = c);
  }
}
function Lp(n) {
  const e = n.tokens_meta, t = n.tokens_meta.length;
  Xs(n.delimiters);
  for (let r = 0; r < t; r++)
    e[r] && e[r].delimiters && Xs(e[r].delimiters);
}
function Vp(n) {
  let e, t, r = 0;
  const i = n.tokens, u = n.tokens.length;
  for (e = t = 0; e < u; e++)
    i[e].nesting < 0 && r--, i[e].level = r, i[e].nesting > 0 && r++, i[e].type === "text" && e + 1 < u && i[e + 1].type === "text" ? i[e + 1].content = i[e].content + i[e + 1].content : (e !== t && (i[t] = i[e]), t++);
  e !== t && (i.length = t);
}
const gi = [
  ["text", xp],
  ["linkify", kp],
  ["newline", Cp],
  ["escape", Sp],
  ["backticks", Ep],
  ["strikethrough", ra.tokenize],
  ["emphasis", ia.tokenize],
  ["link", Mp],
  ["image", Tp],
  ["autolink", Fp],
  ["html_inline", Pp],
  ["entity", Bp]
], bi = [
  ["balance_pairs", Lp],
  ["strikethrough", ra.postProcess],
  ["emphasis", ia.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", Vp]
];
function er() {
  this.ruler = new se();
  for (let n = 0; n < gi.length; n++)
    this.ruler.push(gi[n][0], gi[n][1]);
  this.ruler2 = new se();
  for (let n = 0; n < bi.length; n++)
    this.ruler2.push(bi[n][0], bi[n][1]);
}
er.prototype.skipToken = function(n) {
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
er.prototype.tokenize = function(n) {
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
er.prototype.parse = function(n, e, t, r) {
  const i = new this.State(n, e, t, r);
  this.tokenize(i);
  const u = this.ruler2.getRules(""), s = u.length;
  for (let o = 0; o < s; o++)
    u[o](i);
};
er.prototype.State = Qn;
function qp(n) {
  const e = {};
  n = n || {}, e.src_Any = Ul.source, e.src_Cc = Wl.source, e.src_Z = Jl.source, e.src_P = xu.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
  const t = "[><｜]";
  return e.src_pseudo_letter = `(?:(?!${t}|${e.src_ZPCc})${e.src_Any})`, e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = `(?:(?:(?!${e.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`, e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = `(?=$|${t}|${e.src_ZPCc})(?!${n["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${e.src_ZPCc}))`, e.src_path = `(?:[/?#](?:(?!${e.src_ZCc}|${t}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${e.src_ZCc}|\\]).)*\\]|\\((?:(?!${e.src_ZCc}|[)]).)*\\)|\\{(?:(?!${e.src_ZCc}|[}]).)*\\}|\\"(?:(?!${e.src_ZCc}|["]).)+\\"|\\'(?:(?!${e.src_ZCc}|[']).)+\\'|\\'(?=${e.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${e.src_ZCc}|[.]|$)|` + (n["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  `,(?!${e.src_ZCc}|$)|;(?!${e.src_ZCc}|$)|\\!+(?!${e.src_ZCc}|[!]|$)|\\?(?!${e.src_ZCc}|[?]|$))+|\\/)?`, e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]{0,63}', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + e.src_xn + `|${e.src_pseudo_letter}{1,63})`, e.src_domain = "(?:" + e.src_xn + `|(?:${e.src_pseudo_letter})|(?:${e.src_pseudo_letter}(?:-|${e.src_pseudo_letter}){0,61}${e.src_pseudo_letter}))`, e.src_host = `(?:(?:(?:(?:${e.src_domain})\\.)*${e.src_domain}))`, e.tpl_host_fuzzy = "(?:" + e.src_ip4 + `|(?:(?:(?:${e.src_domain})\\.)+(?:%TLDS%)))`, e.tpl_host_no_ip_fuzzy = `(?:(?:(?:${e.src_domain})\\.)+(?:%TLDS%))`, e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${e.src_ZPCc}|>|$))`, e.tpl_email_fuzzy = `(^|${t}|"|\\(|${e.src_ZCc})(${e.src_email_name}@${e.tpl_host_fuzzy_strict})`, e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  `(^|(?![.:/\\-_@])(?:[$+<=>^\`|｜]|${e.src_ZPCc}))((?![$+<=>^\`|｜])${e.tpl_host_port_fuzzy_strict}${e.src_path})`, e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  `(^|(?![.:/\\-_@])(?:[$+<=>^\`|｜]|${e.src_ZPCc}))((?![$+<=>^\`|｜])${e.tpl_host_port_no_ip_fuzzy_strict}${e.src_path})`, e;
}
function Li(n) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(t) {
    t && Object.keys(t).forEach(function(r) {
      n[r] = t[r];
    });
  }), n;
}
function Wr(n) {
  return Object.prototype.toString.call(n);
}
function Hp(n) {
  return Wr(n) === "[object String]";
}
function Up(n) {
  return Wr(n) === "[object Object]";
}
function Wp(n) {
  return Wr(n) === "[object RegExp]";
}
function Qs(n) {
  return Wr(n) === "[object Function]";
}
function jp(n) {
  return n.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
const ua = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function Jp(n) {
  return Object.keys(n || {}).reduce(function(e, t) {
    return e || ua.hasOwnProperty(t);
  }, !1);
}
const Kp = {
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
}, Zp = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", Gp = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Yp(n) {
  return function(e, t) {
    const r = e.slice(t);
    return n.test(r) ? r.match(n)[0].length : 0;
  };
}
function eo() {
  return function(n, e) {
    e.normalize(n);
  };
}
function Or(n) {
  const e = n.re = qp(n.__opts__), t = n.__tlds__.slice();
  n.onCompile(), n.__tlds_replaced__ || t.push(Zp), t.push(e.src_xn), e.src_tlds = t.join("|");
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
    if (n.__compiled__[o] = a, Up(l)) {
      Wp(l.validate) ? a.validate = Yp(l.validate) : Qs(l.validate) ? a.validate = l.validate : u(o, l), Qs(l.normalize) ? a.normalize = l.normalize : l.normalize ? u(o, l) : a.normalize = eo();
      return;
    }
    if (Hp(l)) {
      i.push(o);
      return;
    }
    u(o, l);
  }), i.forEach(function(o) {
    n.__compiled__[n.__schemas__[o]] && (n.__compiled__[o].validate = n.__compiled__[n.__schemas__[o]].validate, n.__compiled__[o].normalize = n.__compiled__[n.__schemas__[o]].normalize);
  }), n.__compiled__[""] = { validate: null, normalize: eo() };
  const s = Object.keys(n.__compiled__).filter(function(o) {
    return o.length > 0 && n.__compiled__[o];
  }).map(jp).join("|");
  n.re.schema_test = RegExp(`(^|(?!_)(?:[><｜]|${e.src_ZPCc}))(${s})`, "i"), n.re.schema_search = RegExp(`(^|(?!_)(?:[><｜]|${e.src_ZPCc}))(${s})`, "ig"), n.re.schema_at_start = RegExp(`^${n.re.schema_search.source}`, "i"), n.re.pretest = RegExp(
    `(${n.re.schema_test.source})|(${n.re.host_fuzzy_test.source})|@`,
    "i"
  );
}
function sa(n, e, t, r) {
  const i = n.slice(t, r);
  this.schema = e.toLowerCase(), this.index = t, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
}
function ae(n, e) {
  if (!(this instanceof ae))
    return new ae(n, e);
  e || Jp(n) && (e = n, n = {}), this.__opts__ = Li({}, ua, e), this.__schemas__ = Li({}, Kp, n), this.__compiled__ = {}, this.__tlds__ = Gp, this.__tlds_replaced__ = !1, this.re = {}, Or(this);
}
ae.prototype.add = function(e, t) {
  return this.__schemas__[e] = t, Or(this), this;
};
ae.prototype.set = function(e) {
  return this.__opts__ = Li(this.__opts__, e), this;
};
ae.prototype.test = function(e) {
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
ae.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
ae.prototype.testSchemaAt = function(e, t, r) {
  return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, r, this) : 0;
};
ae.prototype.match = function(e) {
  const t = [], r = [], i = [], u = [];
  let s, o, l;
  function a(h, p) {
    return h ? p ? h.index !== p.index ? h.index < p.index ? h : p : h.lastIndex >= p.lastIndex ? h : p : h : p;
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
    const h = [
      r[c[0]],
      u[c[1]],
      i[c[2]]
    ], p = a(a(h[0], h[1]), h[2]);
    if (!p)
      break;
    if (p === h[0] ? c[0]++ : p === h[1] ? c[1]++ : c[2]++, p.index < f)
      continue;
    const d = new sa(e, p.schema, p.index, p.lastIndex);
    this.__compiled__[d.schema].normalize(d, this), t.push(d), f = p.lastIndex;
  }
  return t.length ? t : null;
};
ae.prototype.matchAtStart = function(e) {
  if (!e.length) return null;
  const t = this.re.schema_at_start.exec(e);
  if (!t) return null;
  const r = this.testSchemaAt(e, t[2], t[0].length);
  if (!r) return null;
  const i = new sa(e, t[2], t.index + t[1].length, t.index + t[0].length + r);
  return this.__compiled__[i.schema].normalize(i, this), i;
};
ae.prototype.tlds = function(e, t) {
  return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(r, i, u) {
    return r !== u[i - 1];
  }).reverse(), Or(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, Or(this), this);
};
ae.prototype.normalize = function(e) {
  e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
};
ae.prototype.onCompile = function() {
};
const $t = 2147483647, De = 36, Eu = 1, Nn = 26, Xp = 38, Qp = 700, oa = 72, la = 128, aa = "-", e1 = /^xn--/, t1 = /[^\0-\x7F]/, n1 = /[\x2E\u3002\uFF0E\uFF61]/g, r1 = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, xi = De - Eu, we = Math.floor, yi = String.fromCharCode;
function We(n) {
  throw new RangeError(r1[n]);
}
function i1(n, e) {
  const t = [];
  let r = n.length;
  for (; r--; )
    t[r] = e(n[r]);
  return t;
}
function ca(n, e) {
  const t = n.split("@");
  let r = "";
  t.length > 1 && (r = t[0] + "@", n = t[1]), n = n.replace(n1, ".");
  const i = n.split("."), u = i1(i, e).join(".");
  return r + u;
}
function fa(n) {
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
const u1 = (n) => String.fromCodePoint(...n), s1 = function(n) {
  return n >= 48 && n < 58 ? 26 + (n - 48) : n >= 65 && n < 91 ? n - 65 : n >= 97 && n < 123 ? n - 97 : De;
}, to = function(n, e) {
  return n + 22 + 75 * (n < 26) - ((e != 0) << 5);
}, da = function(n, e, t) {
  let r = 0;
  for (n = t ? we(n / Qp) : n >> 1, n += we(n / e); n > xi * Nn >> 1; r += De)
    n = we(n / xi);
  return we(r + (xi + 1) * n / (n + Xp));
}, ha = function(n) {
  const e = [], t = n.length;
  let r = 0, i = la, u = oa, s = n.lastIndexOf(aa);
  s < 0 && (s = 0);
  for (let o = 0; o < s; ++o)
    n.charCodeAt(o) >= 128 && We("not-basic"), e.push(n.charCodeAt(o));
  for (let o = s > 0 ? s + 1 : 0; o < t; ) {
    const l = r;
    for (let c = 1, f = De; ; f += De) {
      o >= t && We("invalid-input");
      const h = s1(n.charCodeAt(o++));
      h >= De && We("invalid-input"), h > we(($t - r) / c) && We("overflow"), r += h * c;
      const p = f <= u ? Eu : f >= u + Nn ? Nn : f - u;
      if (h < p)
        break;
      const d = De - p;
      c > we($t / d) && We("overflow"), c *= d;
    }
    const a = e.length + 1;
    u = da(r - l, a, l == 0), we(r / a) > $t - i && We("overflow"), i += we(r / a), r %= a, e.splice(r++, 0, i);
  }
  return String.fromCodePoint(...e);
}, pa = function(n) {
  const e = [];
  n = fa(n);
  const t = n.length;
  let r = la, i = 0, u = oa;
  for (const l of n)
    l < 128 && e.push(yi(l));
  const s = e.length;
  let o = s;
  for (s && e.push(aa); o < t; ) {
    let l = $t;
    for (const c of n)
      c >= r && c < l && (l = c);
    const a = o + 1;
    l - r > we(($t - i) / a) && We("overflow"), i += (l - r) * a, r = l;
    for (const c of n)
      if (c < r && ++i > $t && We("overflow"), c === r) {
        let f = i;
        for (let h = De; ; h += De) {
          const p = h <= u ? Eu : h >= u + Nn ? Nn : h - u;
          if (f < p)
            break;
          const d = f - p, m = De - p;
          e.push(
            yi(to(p + d % m, 0))
          ), f = we(d / m);
        }
        e.push(yi(to(f, 0))), u = da(i, a, o === s), i = 0, ++o;
      }
    ++i, ++r;
  }
  return e.join("");
}, o1 = function(n) {
  return ca(n, function(e) {
    return e1.test(e) ? ha(e.slice(4).toLowerCase()) : e;
  });
}, l1 = function(n) {
  return ca(n, function(e) {
    return t1.test(e) ? "xn--" + pa(e) : e;
  });
}, ma = {
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
    decode: fa,
    encode: u1
  },
  decode: ha,
  encode: pa,
  toASCII: l1,
  toUnicode: o1
}, a1 = {
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
}, c1 = {
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
}, f1 = {
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
}, d1 = {
  default: a1,
  zero: c1,
  commonmark: f1
}, h1 = /^(vbscript|javascript|file|data):/, p1 = /^data:image\/(gif|png|jpeg|webp);/;
function m1(n) {
  const e = n.trim().toLowerCase();
  return h1.test(e) ? p1.test(e) : !0;
}
const ga = ["http:", "https:", "mailto:"];
function g1(n) {
  const e = bu(n, !0);
  if (e.hostname && (!e.protocol || ga.indexOf(e.protocol) >= 0))
    try {
      e.hostname = ma.toASCII(e.hostname);
    } catch {
    }
  return Xn(gu(e));
}
function b1(n) {
  const e = bu(n, !0);
  if (e.hostname && (!e.protocol || ga.indexOf(e.protocol) >= 0))
    try {
      e.hostname = ma.toUnicode(e.hostname);
    } catch {
    }
  return Jt(gu(e), Jt.defaultChars + "%");
}
function ce(n, e) {
  if (!(this instanceof ce))
    return new ce(n, e);
  e || yu(n) || (e = n || {}, n = "default"), this.inline = new er(), this.block = new Ur(), this.core = new Cu(), this.renderer = new Gt(), this.linkify = new ae(), this.validateLink = m1, this.normalizeLink = g1, this.normalizeLinkText = b1, this.utils = k0, this.helpers = Vr({}, D0), this.options = {}, this.configure(n), e && this.set(e);
}
ce.prototype.set = function(n) {
  return Vr(this.options, n), this;
};
ce.prototype.configure = function(n) {
  const e = this;
  if (yu(n)) {
    const t = n;
    if (n = d1[t], !n)
      throw new Error('Wrong `markdown-it` preset "' + t + '", check name');
  }
  if (!n)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return n.options && e.set(n.options), n.components && Object.keys(n.components).forEach(function(t) {
    n.components[t].rules && e[t].ruler.enableOnly(n.components[t].rules), n.components[t].rules2 && e[t].ruler2.enableOnly(n.components[t].rules2);
  }), this;
};
ce.prototype.enable = function(n, e) {
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
ce.prototype.disable = function(n, e) {
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
ce.prototype.use = function(n) {
  const e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return n.apply(n, e), this;
};
ce.prototype.parse = function(n, e) {
  if (typeof n != "string")
    throw new Error("Input data should be a String");
  const t = new this.core.State(n, this, e);
  return this.core.process(t), t.tokens;
};
ce.prototype.render = function(n, e) {
  return e = e || {}, this.renderer.render(this.parse(n, e), this.options, e);
};
ce.prototype.parseInline = function(n, e) {
  const t = new this.core.State(n, this, e);
  return t.inlineMode = !0, this.core.process(t), t.tokens;
};
ce.prototype.renderInline = function(n, e) {
  return e = e || {}, this.renderer.render(this.parseInline(n, e), this.options, e);
};
const jr = new Io({
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
function x1(n, e) {
  if (n.isText && e.isText && R.sameSet(n.marks, e.marks))
    return n.withText(n.text + e.text);
}
class y1 {
  constructor(e, t) {
    this.schema = e, this.tokenHandlers = t, this.stack = [{ type: e.topNodeType, attrs: null, content: [], marks: R.none }];
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
    i && (s = x1(i, u)) ? r[r.length - 1] = s : r.push(u);
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
    this.stack.push({ type: e, attrs: t, content: [], marks: R.none });
  }
  // Close and return the node that is currently on top of the stack.
  closeNode() {
    let e = this.stack.pop();
    return this.addNode(e.type, e.attrs, e.content);
  }
}
function Qt(n, e, t, r) {
  return n.getAttrs ? n.getAttrs(e, t, r) : n.attrs instanceof Function ? n.attrs(e) : n.attrs;
}
function ki(n, e) {
  return n.noCloseToken || e == "code_inline" || e == "code_block" || e == "fence";
}
function no(n) {
  return n[n.length - 1] == `
` ? n.slice(0, n.length - 1) : n;
}
function Ci() {
}
function k1(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in e) {
    let i = e[r];
    if (i.block) {
      let u = n.nodeType(i.block);
      ki(i, r) ? t[r] = (s, o, l, a) => {
        s.openNode(u, Qt(i, o, l, a)), s.addText(no(o.content)), s.closeNode();
      } : (t[r + "_open"] = (s, o, l, a) => s.openNode(u, Qt(i, o, l, a)), t[r + "_close"] = (s) => s.closeNode());
    } else if (i.node) {
      let u = n.nodeType(i.node);
      t[r] = (s, o, l, a) => s.addNode(u, Qt(i, o, l, a));
    } else if (i.mark) {
      let u = n.marks[i.mark];
      ki(i, r) ? t[r] = (s, o, l, a) => {
        s.openMark(u.create(Qt(i, o, l, a))), s.addText(no(o.content)), s.closeMark(u);
      } : (t[r + "_open"] = (s, o, l, a) => s.openMark(u.create(Qt(i, o, l, a))), t[r + "_close"] = (s) => s.closeMark(u));
    } else if (i.ignore)
      ki(i, r) ? t[r] = Ci : (t[r + "_open"] = Ci, t[r + "_close"] = Ci);
    else
      throw new RangeError("Unrecognized parsing spec " + JSON.stringify(i));
  }
  return t.text = (r, i) => r.addText(i.content), t.inline = (r, i) => r.parseTokens(i.children), t.softbreak = t.softbreak || ((r) => r.addText(" ")), t;
}
class ba {
  /**
  Create a parser with the given configuration. You can configure
  the markdown-it parser to parse the dialect you want, and provide
  a description of the ProseMirror entities those tokens map to in
  the `tokens` object, which maps token names to descriptions of
  what to do with them. Such a description is an object, and may
  have the following properties:
  */
  constructor(e, t, r) {
    this.schema = e, this.tokenizer = t, this.tokens = r, this.tokenHandlers = k1(e, r);
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
    let r = new y1(this.schema, this.tokenHandlers), i;
    r.parseTokens(this.tokenizer.parse(e, t));
    do
      i = r.closeNode();
    while (r.stack.length);
    return i || this.schema.topNodeType.createAndFill();
  }
}
function ro(n, e) {
  for (; ++e < n.length; )
    if (n[e].type != "list_item_open")
      return n[e].hidden;
  return !1;
}
const C1 = new ba(jr, ce("commonmark", { html: !1 }), {
  blockquote: { block: "blockquote" },
  paragraph: { block: "paragraph" },
  list_item: { block: "list_item" },
  bullet_list: { block: "bullet_list", getAttrs: (n, e, t) => ({ tight: ro(e, t) }) },
  ordered_list: { block: "ordered_list", getAttrs: (n, e, t) => ({
    order: +n.attrGet("start") || 1,
    tight: ro(e, t)
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
}), S1 = { open: "", close: "", mixable: !0 };
class xa {
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
    let r = new D1(this.nodes, this.marks, t);
    return r.renderContent(e), r.out;
  }
}
const io = new xa({
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
      return n.inAutolink = E1(e, t, r), n.inAutolink ? "<" : "[";
    },
    close(n, e, t, r) {
      let { inAutolink: i } = n;
      return n.inAutolink = void 0, i ? ">" : "](" + e.attrs.href.replace(/[\(\)"]/g, "\\$&") + (e.attrs.title ? ` "${e.attrs.title.replace(/"/g, '\\"')}"` : "") + ")";
    },
    mixable: !0
  },
  code: {
    open(n, e, t, r) {
      return uo(t.child(r), -1);
    },
    close(n, e, t, r) {
      return uo(t.child(r - 1), 1);
    },
    escape: !1
  }
});
function uo(n, e) {
  let t = /`+/g, r, i = 0;
  if (n.isText)
    for (; r = t.exec(n.text); )
      i = Math.max(i, r[0].length);
  let u = i > 0 && e > 0 ? " `" : "`";
  for (let s = 0; s < i; s++)
    u += "`";
  return i > 0 && e < 0 && (u += " "), u;
}
function E1(n, e, t) {
  if (n.attrs.title || !/^\w+:/.test(n.attrs.href))
    return !1;
  let r = e.child(t);
  return !r.isText || r.text != n.attrs.href || r.marks[r.marks.length - 1] != n ? !1 : t == e.childCount - 1 || !n.isInSet(e.child(t + 1).marks);
}
class D1 {
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
      t = S1;
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
        let [m, g, y] = /^(\s*)(.*)$/m.exec(s.text);
        g && (c += g, s = y ? s.withText(y) : null, s || (a = r));
      }
      if (s && s.isText && a.some((m) => {
        let g = this.getMark(m.type.name);
        return g && g.expelEnclosingWhitespace && !this.isMarkAhead(e, l + 1, m);
      })) {
        let [m, g, y] = /^(.*?)(\s*)$/m.exec(s.text);
        y && (i = y, s = g ? s.withText(g) : null, s || (a = r));
      }
      let f = a.length ? a[a.length - 1] : null, h = f && this.getMark(f.type.name).escape === !1, p = a.length - (h ? 1 : 0);
      e: for (let m = 0; m < p; m++) {
        let g = a[m];
        if (!this.getMark(g.type.name).mixable)
          break;
        for (let y = 0; y < r.length; y++) {
          let E = r[y];
          if (!this.getMark(E.type.name).mixable)
            break;
          if (g.eq(E)) {
            m > y ? a = a.slice(0, y).concat(g).concat(a.slice(y, m)).concat(a.slice(m + 1, p)) : y > m && (a = a.slice(0, m).concat(a.slice(m + 1, y)).concat(g).concat(a.slice(y, p)));
            continue e;
          }
        }
      }
      let d = 0;
      for (; d < Math.min(r.length, p) && a[d].eq(r[d]); )
        ++d;
      for (; d < r.length; )
        this.text(this.markString(r.pop(), !1, e, l), !1);
      if (c && this.text(c), s) {
        for (; r.length < p; ) {
          let m = a[r.length];
          r.push(m), this.text(this.markString(m, !0, e, l), !1), this.atBlockStart = !1;
        }
        h && s.isText ? this.text(this.markString(f, !0, e, l) + s.text + this.markString(f, !1, e, l + 1), !1) : this.render(s, e, l), this.atBlockStart = !1;
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
const ya = jr.spec.nodes.get("list_item");
if (!ya) throw new Error("CommonMark list_item schema is unavailable.");
const w1 = jr.spec.nodes.update("list_item", {
  ...ya,
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
}), _1 = jr.spec.marks.append({
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
}), z = new Io({ nodes: w1, marks: _1 });
function so(n) {
  return { align: /text-align:\s*(left|center|right)/i.exec(n ?? "")?.[1]?.toLowerCase() ?? null };
}
const Du = new ce("default", {
  html: !1,
  linkify: !1
});
function A1(n) {
  function e(t) {
    const r = [];
    return t.forEach((i) => {
      if (i.type.spec.code || i.marks.some((u) => u.type.spec.code || u.type.name === "link"))
        r.push(i);
      else if (i.isText) {
        const u = i.text;
        let s = 0;
        for (const o of Du.linkify.match(u) ?? [])
          /^https?:\/\//i.test(o.raw) && (o.index > s && r.push(i.cut(s, o.index)), r.push(i.cut(o.index, o.lastIndex).mark(
            z.marks.link.create({ href: o.url }).addToSet(i.marks)
          )), s = o.lastIndex);
        s < u.length && r.push(i.cut(s));
      } else
        r.push(i.copy(e(i.content)));
    }), k.fromArray(r);
  }
  return new w(e(n.content), n.openStart, n.openEnd);
}
Du.core.ruler.after("inline", "sidenote-task-list", (n) => {
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
const M1 = {
  ...C1.tokens,
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
    getAttrs: (n) => so(n.attrGet("style"))
  },
  td: {
    block: "table_cell",
    getAttrs: (n) => so(n.attrGet("style"))
  }
}, T1 = new ba(z, Du, M1);
let wu;
function O1(n) {
  const e = z.nodes.paragraph.create(null, n.content), t = z.topNodeType.create(null, [e]);
  return wu.serialize(t).trim().replace(new RegExp("(?<!\\\\)\\|", "g"), "\\|").replace(/\n/g, "<br>");
}
function N1(n) {
  return n === "left" ? ":---" : n === "center" ? ":---:" : n === "right" ? "---:" : "---";
}
function F1(n, e) {
  const t = [], r = [];
  if (e.forEach((l, a, c) => {
    const f = [];
    l.forEach((h, p, d) => {
      f.push(O1(h)), c === 0 && (r[d] = h.attrs.align ?? null);
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
        (l, a) => N1(r[a] ?? null)
      )
    ),
    ...t.slice(1).map(s)
  ];
  n.write(o.join(`
`)), n.closeBlock(e);
}
wu = new xa(
  {
    ...io.nodes,
    list_item(n, e) {
      e.attrs.checked !== null && n.write(`[${e.attrs.checked ? "x" : " "}] `), n.renderContent(e);
    },
    soft_break(n) {
      n.write(`
`);
    },
    table: F1,
    table_row() {
    },
    table_header() {
    },
    table_cell() {
    }
  },
  {
    ...io.marks,
    link: {
      open: "[",
      close(n, e) {
        const t = e.attrs.href.replace(/[()\"]/g, "\\$&"), r = e.attrs.title ? ` "${e.attrs.title.replace(/"/g, '\\"')}"` : "";
        return `](${t}${r})`;
      },
      mixable: !0
    },
    strike: {
      open: "~~",
      close: "~~",
      mixable: !0,
      expelEnclosingWhitespace: !0
    }
  }
);
function lr(n) {
  return T1.parse(n ?? "");
}
function Ve(n) {
  return wu.serialize(n);
}
function ge(n) {
  return ({ state: e, dispatch: t, view: r }) => n(e, t, r);
}
const v1 = (n, e) => {
  const { selection: t } = n, r = n.schema.nodes.heading, i = n.schema.nodes.paragraph;
  return !t.empty || t.$from.parent.type !== r || t.$from.parent.content.size !== 0 ? !1 : rn(i)(n, e);
}, I1 = (n) => {
  const { selection: e } = n, { $from: t } = e;
  return e.empty && t.depth === 1 && t.parent.type === n.schema.nodes.paragraph && t.parent.content.size === 0;
}, R1 = {
  undo: ge(Sr),
  redo: ge(fn),
  paragraph: ge(rn(z.nodes.paragraph)),
  heading1: ge(
    rn(z.nodes.heading, { level: 1 })
  ),
  heading2: ge(
    rn(z.nodes.heading, { level: 2 })
  ),
  heading3: ge(
    rn(z.nodes.heading, { level: 3 })
  ),
  toggleBold: ge(ur(z.marks.strong)),
  toggleItalic: ge(ur(z.marks.em)),
  toggleCode: ge(ur(z.marks.code)),
  toggleStrike: ge(ur(z.marks.strike)),
  blockquote: ge(wf(z.nodes.blockquote))
};
class ye {
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
    this.match = e, this.match = e, this.handler = typeof t == "string" ? P1(t) : t, this.undoable = r.undoable !== !1, this.inCode = r.inCode || !1, this.inCodeMark = r.inCodeMark !== !1;
  }
}
function P1(n) {
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
const $1 = 500;
function ka({ rules: n }) {
  let e = new $r({
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
        return oo(t, r, i, u, n, e);
      },
      handleDOMEvents: {
        compositionend: (t) => {
          setTimeout(() => {
            let { $cursor: r } = t.state.selection;
            r && oo(t, r.pos, r.pos, "", n, e);
          });
        }
      }
    },
    isInputRules: !0
  });
  return e;
}
function oo(n, e, t, r, i, u) {
  if (n.composing)
    return !1;
  let s = n.state, o = s.doc.resolve(e), l = o.parent.textBetween(Math.max(0, o.parentOffset - $1), o.parentOffset, null, "￼") + r;
  for (let a = 0; a < i.length; a++) {
    let c = i[a];
    if (!c.inCodeMark && o.marks().some((d) => d.type.spec.code))
      continue;
    if (o.parent.type.spec.code) {
      if (!c.inCode)
        continue;
    } else if (c.inCode === "only")
      continue;
    let f = c.match.exec(l);
    if (!f || f[0].length < r.length)
      continue;
    let h = e - (f[0].length - r.length);
    if (!c.inCodeMark) {
      let d = !1;
      if (s.doc.nodesBetween(h, o.pos, (m) => {
        m.isInline && m.marks.some((g) => g.type.spec.code) && (d = !0);
      }), d)
        continue;
    }
    let p = c.handler(s, f, h, t);
    if (p)
      return c.undoable && p.setMeta(u, { transform: p, from: e, to: t, text: r }), n.dispatch(p), !0;
  }
  return !1;
}
new ye(/--$/, "—", { inCodeMark: !1 });
new ye(/\.\.\.$/, "…", { inCodeMark: !1 });
new ye(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“", { inCodeMark: !1 });
new ye(/"$/, "”", { inCodeMark: !1 });
new ye(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘", { inCodeMark: !1 });
new ye(/'$/, "’", { inCodeMark: !1 });
function Si(n, e, t = null, r) {
  return new ye(n, (i, u, s, o) => {
    let l = t instanceof Function ? t(u) : t, a = i.tr.delete(s, o), c = a.doc.resolve(s), f = c.blockRange(), h = f && qo(f, e, l);
    if (!h)
      return null;
    a.wrap(f, h);
    let p = a.doc.resolve(s - 1).nodeBefore;
    return p && p.type == e && Rr(a.doc, s - 1) && (!r || r(u, p)) && a.join(s - 1), a;
  });
}
function lo(n, e, t = null) {
  return new ye(n, (r, i, u, s) => {
    let o = r.doc.resolve(u), l = t instanceof Function ? t(i) : t;
    return o.node(-1).canReplaceWith(o.index(-1), o.indexAfter(-1), e) ? r.tr.delete(u, s).setBlockType(u, u, e, l) : null;
  });
}
class z1 {
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
        Ft(
          Object.fromEntries(
            Object.entries(t.shortcuts).map(([r, i]) => [
              r,
              (u, s, o) => i({ state: u, dispatch: s, view: o })
            ])
          )
        )
      ), t.inputRules?.length && e.push(
        ka({
          rules: t.inputRules.map(
            (r) => new ye(
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
function B1() {
  const n = [
    lo(
      /^(#{1,6})\s$/,
      z.nodes.heading,
      (e) => ({ level: e[1].length })
    ),
    lo(/^```$/, z.nodes.code_block),
    Si(/^\s*>\s$/, z.nodes.blockquote),
    Si(/^\s*([-+*])\s$/, z.nodes.bullet_list),
    Si(
      /^(\d+)\.\s$/,
      z.nodes.ordered_list,
      (e) => ({ order: Number(e[1]) }),
      (e, t) => t.childCount + t.attrs.order === Number(e[1])
    ),
    new ye(/^\[([ xX])\]\s$/, (e, t, r, i) => {
      const u = e.doc.resolve(r);
      for (let s = u.depth; s > 0; s -= 1) {
        const o = u.node(s);
        if (o.type === z.nodes.list_item)
          return e.tr.delete(r, i).setNodeMarkup(u.before(s), void 0, {
            ...o.attrs,
            checked: t[1].toLowerCase() === "x"
          });
      }
      return null;
    }),
    new ye(/^---$/, (e, t, r, i) => {
      const u = z.nodes.horizontal_rule;
      return u ? e.tr.replaceWith(r, i, u.create()) : null;
    })
  ];
  return ka({ rules: n });
}
const L1 = Ha`
  :host {
    --editor-background: transparent;
    --editor-color: inherit;
    --editor-border: 0;
    --editor-border-radius: 0;
    --editor-border-color: currentColor;
    --editor-muted-background: transparent;
    --editor-list-marker-color: color-mix(in srgb, currentColor 60%, transparent);
    --editor-table-border-color: currentColor;
    --editor-table-aligned-cell-padding: 5px;
    --editor-code-background: var(--editor-muted-background);
    --editor-accent: currentColor;
    --editor-font-family: inherit;
    --editor-code-font-family: inherit;
    --editor-font-size: inherit;
    --editor-min-height: 240px;
    --editor-padding: 0;
    --editor-line-height: 1.5;
    --editor-heading-line-height: 1.5;
    --editor-source-line-height: 1.2;
    --editor-code-line-height: 1.2;
    --editor-code-padding: 0;
    --editor-code-content-padding: 5px;
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
    margin-block: 1em;
    line-height: var(--editor-line-height);
  }

  .editor-mount .ProseMirror h1,
  .editor-mount .ProseMirror h2,
  .editor-mount .ProseMirror h3,
  .editor-mount .ProseMirror h4,
  .editor-mount .ProseMirror h5,
  .editor-mount .ProseMirror h6 {
    font-weight: 700;
    line-height: var(--editor-heading-line-height);
  }

  .editor-mount .ProseMirror h1 {
    margin-block: 0.67em;
    font-size: 2em;
  }

  .editor-mount .ProseMirror h2 {
    margin-block: 0.83em;
    font-size: 1.5em;
  }

  .editor-mount .ProseMirror h3 {
    margin-block: 1em;
    font-size: 1.17em;
  }

  .editor-mount .ProseMirror h4 {
    margin-block: 1.33em;
    font-size: 1em;
  }

  .editor-mount .ProseMirror h5 {
    margin-block: 1.67em;
    font-size: 0.83em;
  }

  .editor-mount .ProseMirror h6 {
    margin-block: 2.33em;
    font-size: 0.67em;
  }

  .editor-mount .ProseMirror strong {
    font-weight: 700;
  }

  .editor-mount .ProseMirror em {
    font-style: italic;
  }

  .editor-mount .ProseMirror ul,
  .editor-mount .ProseMirror ol {
    margin-block: 1em;
  }

  .editor-mount .ProseMirror li::marker {
    color: var(--editor-list-marker-color);
  }

  .editor-mount .ProseMirror blockquote {
    margin: 1em 40px 1em 0;
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
    padding: var(--editor-code-content-padding);
  }

  .editor-mount .ProseMirror .code-block-container pre {
    margin-top: 0;
  }

  .editor-mount .ProseMirror .code-block-content,
  .editor-mount .ProseMirror .code-block-content > pre,
  .editor-mount .ProseMirror .code-block-content > pre > code {
    background: var(--editor-code-background);
  }

  .editor-mount .ProseMirror pre.code-block-body,
  .editor-mount .ProseMirror pre.code-block-body > code {
    line-height: var(--editor-code-line-height);
  }

  .code-block-content[data-line-numbers] {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: var(--editor-code-content-padding);
  }

  .code-block-content[data-line-numbers] > pre {
    padding-block: var(--editor-code-content-padding);
  }

  .code-block-content[data-line-numbers] > pre > code {
    padding-block: 0;
  }

  .code-block-content[data-line-numbers] > pre.code-block-body > code {
    padding-inline: 0 var(--editor-code-content-padding);
  }

  .code-block-content pre {
    min-width: 0;
  }

  .code-line-numbers {
    font-family: var(--editor-code-font-family);
    line-height: var(--editor-code-line-height);
    vertical-align: top;
    white-space: pre;
    word-break: keep-all;
    user-select: none;
  }

  .code-line-numbers[hidden] {
    display: none;
  }

  .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }

  .code-block-header[hidden] {
    display: none;
  }

  .code-block-language {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .copy-code-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  .code-block-language-control {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
  }

  .code-block-language-display {
    display: block;
    user-select: none;
  }

  .code-block-language-editor {
    box-sizing: border-box;
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: inherit;
    outline: none;
    opacity: 0;
    cursor: text;
    user-select: none;
  }

  .code-block-language-editor:not([readonly]):focus {
    opacity: 1;
    user-select: text;
  }

  .code-block-language-editor:not([readonly]):focus
    + .code-block-language-display {
    visibility: hidden;
  }

  .code-block-language-editor[readonly] {
    cursor: text;
    user-select: none;
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
    font: inherit;
    margin: calc((var(--editor-line-height) - 1) * 0.5em) 0 0;
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
    border: 1px solid var(--editor-table-border-color);
    padding: 0;
    text-align: center;
    vertical-align: top;
  }

  .editor-mount .ProseMirror th[style*='text-align: left'],
  .editor-mount .ProseMirror td[style*='text-align: left'] {
    padding-left: var(--editor-table-aligned-cell-padding);
  }

  .editor-mount .ProseMirror th[style*='text-align: right'],
  .editor-mount .ProseMirror td[style*='text-align: right'] {
    padding-right: var(--editor-table-aligned-cell-padding);
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
    line-height: var(--editor-source-line-height);
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
    line-height: var(--editor-source-line-height);
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
var C, Ie, Ke, gt, Ze, Fn, vn, In, Rn, Pn, $n, zn, Bn, bt, zt, Bt, Se, Lt, Ge, Re, Ye, x, qi, Z, Hi, Ui, Ca, Sa, Wi, It, hr, ji, Ji, un, Ea, Da, wa, _a, Aa, Ki, Ma, Ta, Oa, Na, pr, Fa, mr, Ln, gr, va, Ia, Ra, Pa, $a, za, Ba, Zi, La, Vn, qn, Hn, Gi, Un, Wn;
const pn = class pn extends on {
  constructor() {
    super();
    $(this, x);
    $(this, C);
    $(this, Ie);
    $(this, Ke);
    $(this, gt);
    $(this, Ze);
    $(this, Fn);
    $(this, vn);
    $(this, In);
    $(this, Rn);
    $(this, Pn);
    $(this, $n);
    $(this, zn);
    $(this, Bn);
    $(this, bt);
    $(this, zt);
    $(this, Bt);
    $(this, Se);
    $(this, Lt);
    $(this, Ge);
    $(this, Re);
    $(this, Ye);
    $(this, Ln);
    $(this, Vn);
    $(this, qn);
    $(this, Hn);
    $(this, Un);
    $(this, Wn);
    this.value = "", this.mode = "wysiwyg", this.placeholder = "", this.readonly = !1, this.disabled = !1, this.name = "", this.sourceEditScope = "document", this.showCodeBlockHeader = !0, this.showCodeLineNumbers = !1, this.preventExtraEmptyParagraphs = !0, this.themeCss = "", this.blockSourceOpen = !1, this.blockSourceValue = "", this.documentSourceValue = "", N(this, Ie, new z1()), N(this, gt, ""), N(this, Ze, []), N(this, Fn, $f()), N(this, vn, B1()), N(this, In, new $r({
      props: {
        decorations: (t) => S(this, x, Na).call(this, t.doc)
      }
    })), N(this, Rn, Ft({
      "Mod-z": Sr,
      "Shift-Mod-z": fn,
      "Mod-y": fn
    })), N(this, Pn, Ft({
      Backspace: v1,
      Enter: (t) => this.preventExtraEmptyParagraphs && I1(t)
    })), N(this, $n, Ft({
      "Shift-Enter": zr(tl, (t, r) => {
        const i = t.schema.nodes.soft_break, { $from: u, $to: s } = t.selection;
        return !i || !u.sameParent(s) || !u.parent.inlineContent ? !1 : (r && r(t.tr.replaceSelectionWith(i.create()).scrollIntoView()), !0);
      })
    })), N(this, zn, Ft({
      Enter: jf(z.nodes.list_item),
      Tab: Gf(z.nodes.list_item),
      "Shift-Tab": Jf(z.nodes.list_item)
    })), N(this, Bn, Ft(Mf)), N(this, zt, ""), N(this, Bt, "wysiwyg"), N(this, Ge, /* @__PURE__ */ new Map()), N(this, Re, /* @__PURE__ */ new Map()), N(this, Ye, /* @__PURE__ */ new Set()), this.cancelBlockSourceEdit = () => {
      this.blockSourceOpen = !1, this.blockSourceValue = "", N(this, Ke, void 0), b(this, C)?.setProps({ editable: () => S(this, x, Z).call(this) }), S(this, x, mr).call(this), b(this, C)?.focus();
    }, this.applyBlockSourceEdit = () => {
      if (!b(this, C) || !b(this, Ke)) return;
      const t = S(this, x, It).call(this, this.blockSourceValue), { from: r, to: i } = b(this, Ke);
      b(this, C).dispatch(
        b(this, C).state.tr.replaceWith(r, i, t.content).scrollIntoView().setMeta("wysiwygMarkdownSource", "source-edit")
      ), this.blockSourceOpen = !1, this.blockSourceValue = "", N(this, Ke, void 0), b(this, C).setProps({ editable: () => S(this, x, Z).call(this) }), S(this, x, mr).call(this), S(this, x, ji).call(this, "source-edit"), b(this, C).focus();
    }, N(this, Ln, (t) => {
      if (!b(this, C) || this.disabled || this.readonly) return;
      const r = t.target;
      if (r instanceof HTMLInputElement && r.matches('li[data-task] > input[type="checkbox"]'))
        return;
      if (this.sourceEditScope !== "block") {
        let c;
        try {
          const f = b(this, C).posAtCoords({
            left: t.clientX,
            top: t.clientY
          });
          f && (c = S(this, x, gr).call(this, f.pos));
        } catch {
        }
        t.preventDefault(), N(this, Se, c), this.setMode("source");
        return;
      }
      if (!S(this, x, Z).call(this)) return;
      const i = b(this, C).posAtCoords({
        left: t.clientX,
        top: t.clientY
      });
      if (!i) return;
      const u = b(this, C).state.doc.resolve(i.pos);
      if (u.depth < 1) return;
      const s = u.node(1), o = u.before(1), l = u.after(1), a = z.topNodeType.create(null, [s]);
      N(this, Ke, { from: o, to: l }), this.blockSourceValue = Ve(a), this.blockSourceOpen = !0, b(this, C).setProps({ editable: () => S(this, x, Z).call(this) }), this.updateComplete.then(() => {
        const c = this.renderRoot.querySelector("#block-source");
        c?.focus(), c?.select();
      });
    }), N(this, Vn, (t) => {
      this.documentSourceValue = t.currentTarget.value, this.value = this.documentSourceValue, S(this, x, hr).call(this, "source-edit");
    }), N(this, qn, (t) => {
      (t.ctrlKey || t.metaKey) && t.key === "Enter" && (t.preventDefault(), this.setMode(b(this, Bt)));
    }), N(this, Hn, (t) => {
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
          S(this, x, Gi).call(this, r, `![${c}](${a})`, o, l);
        }).catch((a) => S(this, x, un).call(this, a, `[image paste: ${i.name}]`));
        return;
      }
      if (!this.transformPastedText) return;
      const u = t.clipboardData?.getData("text/plain");
      if (u === void 0) return;
      const s = this.transformPastedText(u);
      s !== u && (t.preventDefault(), S(this, x, Gi).call(this, r, s));
    }), N(this, Un, (t) => {
      this.blockSourceValue = t.currentTarget.value;
    }), N(this, Wn, (t) => {
      if (t.key === "Escape") {
        t.preventDefault(), this.cancelBlockSourceEdit();
        return;
      }
      (t.ctrlKey || t.metaKey) && t.key === "Enter" && (t.preventDefault(), this.applyBlockSourceEdit());
    }), typeof this.attachInternals == "function" && N(this, bt, this.attachInternals());
  }
  connectedCallback() {
    super.connectedCallback(), this.hasAttribute("role") || this.setAttribute("role", "textbox"), this.hasAttribute("aria-multiline") || this.setAttribute("aria-multiline", "true"), this.hasUpdated && !b(this, C) && this.updateComplete.then(() => S(this, x, qi).call(this));
  }
  render() {
    const t = this.mode === "source", r = !this.value.trim();
    return Zr`
      <div class="surface" part="surface">
        ${r && !t && this.placeholder ? Zr`<div class="placeholder" part="placeholder">${this.placeholder}</div>` : V}
        <div
          id="editor-mount"
          class="editor-mount"
          part="editor"
          ?hidden=${t}
          @dblclick=${b(this, Ln)}
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
          @input=${b(this, Vn)}
          @keydown=${b(this, qn)}
          @paste=${b(this, Hn)}
        ></textarea>
        ${this.blockSourceOpen ? Zr`
              <section class="block-source-panel" part="block-source-panel">
                <textarea
                  id="block-source"
                  aria-label="Block Markdown source"
                  spellcheck="false"
                  .value=${this.blockSourceValue}
                  @input=${b(this, Un)}
                  @keydown=${b(this, Wn)}
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
    S(this, x, qi).call(this);
  }
  willUpdate(t) {
    if (!this.hasUpdated && t.has("value") && (this.value = Ve(S(this, x, It).call(this, this.value))), t.has("mode")) {
      const r = t.get("mode");
      if (this.mode === "source")
        this.documentSourceValue = this.value, r !== "source" && b(this, Se) === void 0 && N(this, Se, b(this, C) ? S(this, x, gr).call(this, b(this, C).state.selection.head) : void 0);
      else if (r === "source") {
        const i = this.renderRoot.querySelector(
          "#document-source"
        ), u = i?.value ?? this.documentSourceValue, s = i?.selectionStart ?? u.length;
        N(this, Lt, S(this, x, va).call(this, u, s));
      }
    }
  }
  updated(t) {
    if (b(this, C)) {
      if (t.has("value") && this.mode !== "source" && this.value !== b(this, gt) && S(this, x, Wi).call(this, this.value, !1), t.has("mode")) {
        const r = t.get("mode"), i = r !== "source" && this.mode === "source", u = r === "source" && this.mode !== "source";
        if (u && S(this, x, Wi).call(this, this.documentSourceValue, !0, "source-edit"), b(this, C).setProps({ editable: () => S(this, x, Z).call(this) }), i) {
          const s = b(this, Se);
          N(this, Se, void 0), S(this, x, Ia).call(this, s);
        } else if (u) {
          const s = b(this, Lt);
          N(this, Lt, void 0), s !== void 0 && S(this, x, Pa).call(this, s);
        }
        this.dispatchEvent(
          new CustomEvent("mode-change", {
            detail: { mode: this.mode },
            bubbles: !0,
            composed: !0
          })
        );
      }
      if ((t.has("readonly") || t.has("disabled")) && b(this, C).setProps({ editable: () => S(this, x, Z).call(this) }), (t.has("mode") || t.has("readonly") || t.has("disabled")) && S(this, x, mr).call(this), (t.has("showCodeBlockHeader") || t.has("showCodeLineNumbers") || t.has("mode") || t.has("readonly") || t.has("disabled")) && S(this, x, Oa).call(this), t.has("codeHighlighter") && b(this, C).dispatch(b(this, C).state.tr), (t.has("value") || t.has("disabled")) && S(this, x, Ji).call(this), t.has("themeCss")) {
        const r = this.renderRoot.querySelector("#host-theme");
        r && (r.textContent = this.themeCss);
      }
    }
  }
  disconnectedCallback() {
    b(this, C)?.destroy(), N(this, C, void 0), S(this, x, Ma).call(this), super.disconnectedCallback();
  }
  getMarkdown() {
    return this.value;
  }
  setMarkdown(t) {
    this.value = t ?? "", this.mode === "source" && (this.documentSourceValue = this.value);
  }
  formResetCallback() {
    this.setMarkdown(b(this, zt));
  }
  setMode(t) {
    if (!["wysiwyg", "source", "readonly"].includes(t))
      throw new Error(`Unsupported editor mode: ${t}`);
    t === "source" && this.mode !== "source" && (N(this, Bt, this.mode), b(this, Se) === void 0 && b(this, C) && N(this, Se, S(this, x, gr).call(this, b(this, C).state.selection.head))), this.mode = t;
  }
  focus(t) {
    if (this.mode === "source") {
      this.updateComplete.then(
        () => this.renderRoot.querySelector("#document-source")?.focus(t)
      );
      return;
    }
    b(this, C)?.focus();
  }
  undo() {
    return b(this, C) ? Sr(
      b(this, C).state,
      (t) => b(this, C)?.dispatch(t.setMeta("wysiwygMarkdownSource", "command")),
      b(this, C)
    ) : !1;
  }
  redo() {
    return b(this, C) ? fn(
      b(this, C).state,
      (t) => b(this, C)?.dispatch(t.setMeta("wysiwygMarkdownSource", "command")),
      b(this, C)
    ) : !1;
  }
  execute(t) {
    if (!b(this, C)) return !1;
    const r = S(this, x, Ca).call(this)[t];
    return r ? r({
      state: b(this, C).state,
      dispatch: (i) => b(this, C)?.dispatch(i.setMeta("wysiwygMarkdownSource", "command")),
      view: b(this, C)
    }) : !1;
  }
  use(t) {
    b(this, Ie).add(t), S(this, x, Ui).call(this);
  }
  removeExtension(t) {
    const r = b(this, Ie).remove(t);
    return r && S(this, x, Ui).call(this), r;
  }
  getExtensions() {
    return b(this, Ie).list();
  }
  insertText(t) {
    if (!b(this, C) || !S(this, x, Z).call(this)) return !1;
    const { from: r, to: i } = b(this, C).state.selection;
    return b(this, C).dispatch(
      b(this, C).state.tr.insertText(t, r, i).setMeta("wysiwygMarkdownSource", "api")
    ), !0;
  }
  insertMarkdown(t) {
    if (!b(this, C) || !S(this, x, Z).call(this)) return !1;
    const r = S(this, x, It).call(this, t), { from: i, to: u } = b(this, C).state.selection;
    return b(this, C).dispatch(
      b(this, C).state.tr.replaceWith(i, u, r.content).scrollIntoView().setMeta("wysiwygMarkdownSource", "api")
    ), !0;
  }
  replaceSelection(t) {
    return this.insertMarkdown(t);
  }
  insertImage(t, r = "Image", i = null) {
    if (!b(this, C) || !S(this, x, Z).call(this)) return !1;
    const u = z.nodes.image.create({ src: t, alt: r, title: i });
    return b(this, C).dispatch(
      b(this, C).state.tr.replaceSelectionWith(u).scrollIntoView().setMeta("wysiwygMarkdownSource", "api")
    ), !0;
  }
  scrollToImage(t, r = { behavior: "smooth", block: "center" }) {
    const i = Array.from(
      this.renderRoot.querySelectorAll("img[data-source]")
    ).find((u) => u.dataset.source === t);
    return i ? (i.scrollIntoView(r), !0) : !1;
  }
};
C = new WeakMap(), Ie = new WeakMap(), Ke = new WeakMap(), gt = new WeakMap(), Ze = new WeakMap(), Fn = new WeakMap(), vn = new WeakMap(), In = new WeakMap(), Rn = new WeakMap(), Pn = new WeakMap(), $n = new WeakMap(), zn = new WeakMap(), Bn = new WeakMap(), bt = new WeakMap(), zt = new WeakMap(), Bt = new WeakMap(), Se = new WeakMap(), Lt = new WeakMap(), Ge = new WeakMap(), Re = new WeakMap(), Ye = new WeakMap(), x = new WeakSet(), qi = function() {
  if (b(this, C)) return;
  const t = this.renderRoot.querySelector("#editor-mount");
  if (!t) throw new Error("Editor mount element was not created.");
  const r = S(this, x, It).call(this, this.value);
  N(this, gt, Ve(r)), N(this, zt, this.value), this.documentSourceValue = this.value, N(this, Ze, S(this, x, Hi).call(this));
  const i = Rt.create({
    doc: r,
    schema: z,
    plugins: b(this, Ze)
  });
  N(this, C, new Hl(t, {
    state: i,
    editable: () => S(this, x, Z).call(this),
    dispatchTransaction: (u) => S(this, x, Sa).call(this, u),
    transformPastedText: (u) => this.transformPastedText?.(u) ?? u,
    transformPasted: (u, s) => {
      const { selection: o, storedMarks: l } = s.state;
      return o.$from.parent.type.spec.code || (l ?? o.$from.marks()).some((a) => a.type.spec.code) ? u : A1(u);
    },
    handlePaste: (u, s) => S(this, x, Ea).call(this, u, s),
    handleDOMEvents: {
      blur: () => (S(this, x, ji).call(this, "keyboard"), !1),
      auxclick: (u, s) => S(this, x, za).call(this, s),
      click: (u, s) => S(this, x, Ba).call(this, s) || S(this, x, La).call(this, s)
    },
    nodeViews: {
      code_block: (u, s, o) => S(this, x, _a).call(this, u, s, o),
      image: (u) => S(this, x, wa).call(this, u),
      list_item: (u, s, o) => S(this, x, Fa).call(this, u, s, o)
    }
  })), S(this, x, Ji).call(this);
}, Z = function() {
  return this.mode === "wysiwyg" && !this.readonly && !this.disabled && !this.blockSourceOpen;
}, Hi = function() {
  return [
    b(this, Fn),
    b(this, Pn),
    b(this, vn),
    b(this, In),
    ...b(this, Ie).plugins(),
    b(this, zn),
    b(this, $n),
    b(this, Rn),
    b(this, Bn)
  ];
}, Ui = function() {
  b(this, C) && (N(this, Ze, S(this, x, Hi).call(this)), b(this, C).updateState(
    b(this, C).state.reconfigure({ plugins: b(this, Ze) })
  ));
}, Ca = function() {
  return b(this, Ie).commands(R1);
}, Sa = function(t) {
  if (!b(this, C)) return;
  const r = b(this, C).state.apply(t);
  if (b(this, C).updateState(r), t.docChanged) {
    const i = Ve(r.doc);
    if (N(this, gt, i), this.value = i, this.documentSourceValue = i, !t.getMeta("wysiwygMarkdownSilent")) {
      const u = t.getMeta("wysiwygMarkdownSource") ?? (t.getMeta("paste") ? "paste" : "keyboard");
      S(this, x, hr).call(this, u);
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
}, Wi = function(t, r, i = "api") {
  if (!b(this, C)) return;
  const u = S(this, x, It).call(this, t), s = b(this, C).state.tr.replaceWith(
    0,
    b(this, C).state.doc.content.size,
    u.content
  );
  s.setMeta("wysiwygMarkdownSource", i), s.setMeta("wysiwygMarkdownSilent", !r), i === "api" && s.setMeta("addToHistory", !1), b(this, C).dispatch(s);
}, It = function(t) {
  try {
    return lr(t);
  } catch (r) {
    return S(this, x, un).call(this, r, t), lr("");
  }
}, hr = function(t) {
  this.dispatchEvent(
    new CustomEvent("input", {
      detail: { markdown: this.value, source: t },
      bubbles: !0,
      composed: !0
    })
  );
}, ji = function(t) {
  this.dispatchEvent(
    new CustomEvent("change", {
      detail: { markdown: this.value, source: t },
      bubbles: !0,
      composed: !0
    })
  );
}, Ji = function() {
  b(this, bt) && typeof b(this, bt).setFormValue == "function" && b(this, bt).setFormValue(this.disabled ? null : this.value);
}, un = function(t, r) {
  this.dispatchEvent(
    new CustomEvent("editor-error", {
      detail: { error: t, markdown: r },
      bubbles: !0,
      composed: !0
    })
  );
}, Ea = function(t, r) {
  const i = [...r.clipboardData?.files ?? []].find(
    (s) => s.type.startsWith("image/")
  );
  if (!i || !this.uploadImage) return !1;
  r.preventDefault();
  const u = {
    from: t.state.selection.from,
    to: t.state.selection.to
  };
  return S(this, x, Da).call(this, i, u), !0;
}, Da = async function(t, r) {
  if (!(!b(this, C) || !this.uploadImage))
    try {
      const i = await this.uploadImage(t);
      if (!i || !b(this, C)) return;
      const u = z.nodes.image.create({
        src: i,
        alt: t.name || "Image",
        title: null
      }), s = b(this, C).state.doc.content.size, o = Math.min(r.from, s), l = Math.min(r.to, s);
      b(this, C).dispatch(
        b(this, C).state.tr.replaceWith(o, l, u).scrollIntoView().setMeta("wysiwygMarkdownSource", "paste")
      );
    } catch (i) {
      S(this, x, un).call(this, i, `[image paste: ${t.name}]`);
    }
}, wa = function(t) {
  const r = document.createElement("img");
  let i = t, u = null, s = !1;
  const o = async (l) => {
    r.dataset.source = l, r.alt = i.attrs.alt ?? "", r.title = i.attrs.title ?? "";
    try {
      if (u = this.imageResolver ? await this.imageResolver(l) : l, s) {
        S(this, x, pr).call(this, u);
        return;
      }
      u ? (r.src = u, r.removeAttribute("data-missing")) : (r.removeAttribute("src"), r.dataset.missing = "true", r.alt = i.attrs.alt || `Image not found: ${l}`);
    } catch (a) {
      r.removeAttribute("src"), r.dataset.missing = "true", S(this, x, un).call(this, a, l);
    }
  };
  return o(i.attrs.src), {
    dom: r,
    update: (l) => l.type !== i.type ? !1 : (S(this, x, pr).call(this, u), u = null, i = l, o(l.attrs.src), !0),
    destroy: () => {
      s = !0, S(this, x, pr).call(this, u);
    }
  };
}, _a = function(t, r, i) {
  const u = document.createElement("div");
  u.className = "code-block-container";
  const s = document.createElement("div");
  s.className = "code-block-header", s.setAttribute("part", "code-block-header"), s.contentEditable = "false";
  const o = document.createElement("span");
  o.className = "code-block-language-control", o.setAttribute("part", "code-block-language-control");
  const l = document.createElement("input");
  l.type = "text", l.className = "code-block-language code-block-language-editor", l.setAttribute("part", "code-block-language-editor"), l.setAttribute("aria-label", "Code language"), l.title = "Edit code language", l.placeholder = "text", l.autocomplete = "off", l.spellcheck = !1, l.readOnly = !S(this, x, Z).call(this);
  const a = document.createElement("span");
  a.className = "code-block-language code-block-language-display", a.setAttribute("part", "code-block-language"), a.setAttribute("aria-hidden", "true"), o.append(l, a);
  const c = document.createElement("button");
  c.type = "button", c.className = "copy-code-button", c.setAttribute("part", "copy-code-button"), c.setAttribute("aria-label", "Copy code"), c.setAttribute("aria-live", "polite"), c.setAttribute("aria-atomic", "true"), c.title = "Copy code", c.textContent = "📄";
  const f = document.createElement("pre");
  f.className = "code-block-body", f.setAttribute("part", "code-block-body");
  const h = document.createElement("code");
  h.className = "hljs", f.append(h);
  const p = document.createElement("div");
  p.className = "code-block-content";
  const d = document.createElement("pre");
  d.className = "code-line-numbers", d.setAttribute("part", "code-line-numbers"), d.setAttribute("aria-hidden", "true"), d.contentEditable = "false";
  const m = document.createElement("code");
  d.append(m), p.append(d, f), s.append(o, c), u.append(s, p);
  let g = t;
  const y = () => {
    const T = i(), H = typeof T == "number" ? b(this, Ge).get(T) ?? "idle" : "idle";
    c.dataset.copyState = H, H === "success" ? (c.textContent = "✓", c.setAttribute("aria-label", "Code copied"), c.title = "Code copied") : H === "error" ? (c.textContent = "!", c.setAttribute("aria-label", "Copy failed"), c.title = "Copy failed") : (c.textContent = "📄", c.setAttribute("aria-label", "Copy code"), c.title = "Copy code");
  }, E = () => {
    const H = String(g.attrs.params ?? "").trim().split(/\s+/)[0] || "", Oe = H || "text";
    l.matches(":focus") || (l.value = H), a.textContent = Oe, h.dataset.language = Oe, s.hidden = !this.showCodeBlockHeader;
    const lt = g.textContent.split(`
`), at = this.showCodeLineNumbers && lt.length > 1;
    m.textContent = lt.map((At, Le) => Le + 1).join(`
`), d.hidden = !at, p.dataset.lineCount = String(lt.length), p.toggleAttribute("data-line-numbers", at), y();
  }, D = () => {
    if (l.readOnly) return;
    const T = String(g.attrs.params ?? "").trim(), H = T.split(/\s+/)[0] || "", Oe = (l.value.trim().split(/\s+/)[0] || "").replaceAll("`", ""), lt = T.slice(H.length), at = Oe ? `${Oe}${lt}`.trim() : "";
    if (at === T) return;
    const At = i();
    typeof At == "number" && r.dispatch(
      r.state.tr.setNodeMarkup(At, void 0, {
        ...g.attrs,
        params: at || null
      }).setMeta("wysiwygMarkdownSource", "command")
    );
  }, A = () => {
    const T = String(g.attrs.params ?? "").trim();
    l.value = T.split(/\s+/)[0] || "", l.blur();
  }, M = (T) => {
    T.key === "Enter" ? (T.preventDefault(), T.stopPropagation(), l.blur()) : T.key === "Escape" && (T.preventDefault(), T.stopPropagation(), A());
  }, F = (T) => {
    T.stopPropagation();
  }, _ = (T) => {
    const H = i();
    typeof H == "number" && S(this, x, Aa).call(this, H, T);
  }, v = async () => {
    try {
      await S(this, x, Ta).call(this, g.textContent), _("success");
    } catch {
      _("error");
    }
  };
  return l.addEventListener("input", F), l.addEventListener("keydown", M), l.addEventListener("blur", D), c.addEventListener("click", v), b(this, Ye).add(y), E(), {
    dom: u,
    contentDOM: h,
    update: (T) => T.type !== g.type ? !1 : (g = T, E(), !0),
    stopEvent: (T) => s.contains(T.target) || d.contains(T.target),
    destroy: () => {
      b(this, Ye).delete(y), l.removeEventListener("input", F), l.removeEventListener("keydown", M), l.removeEventListener("blur", D), c.removeEventListener("click", v);
    }
  };
}, Aa = function(t, r) {
  const i = b(this, Re).get(t);
  i && clearTimeout(i), b(this, Ge).set(t, r), S(this, x, Ki).call(this);
  const u = setTimeout(() => {
    b(this, Ge).delete(t), b(this, Re).delete(t), S(this, x, Ki).call(this);
  }, 1e3);
  b(this, Re).set(t, u);
}, Ki = function() {
  b(this, Ye).forEach((t) => t());
}, Ma = function() {
  b(this, Re).forEach((t) => clearTimeout(t)), b(this, Re).clear(), b(this, Ge).clear(), b(this, Ye).clear();
}, Ta = async function(t) {
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
}, Oa = function() {
  this.renderRoot.querySelectorAll(".code-block-container").forEach(
    (t) => {
      const r = t.querySelector(".code-block-header"), i = t.querySelector(".code-block-content"), u = t.querySelector(".code-line-numbers"), s = t.querySelector(
        ".code-block-language-editor"
      ), o = this.showCodeLineNumbers && Number(i?.dataset.lineCount ?? 0) > 1, l = S(this, x, Z).call(this);
      r && (r.hidden = !this.showCodeBlockHeader), u && (u.hidden = !o), s && (!l && !s.readOnly && s.blur(), s.readOnly = !l), i?.toggleAttribute("data-line-numbers", o);
    }
  );
}, Na = function(t) {
  if (!this.codeHighlighter) return L.empty;
  const r = [];
  return t.descendants((i, u) => {
    if (i.type !== z.nodes.code_block) return !0;
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
}, pr = function(t) {
  t?.startsWith("blob:") && typeof URL.revokeObjectURL == "function" && URL.revokeObjectURL(t);
}, Fa = function(t, r, i) {
  const u = document.createElement("li");
  let s = t;
  if (s.attrs.checked === null)
    return { dom: u, contentDOM: u };
  u.dataset.task = "true";
  const o = document.createElement("input");
  o.type = "checkbox", o.contentEditable = "false", o.setAttribute("aria-label", "Toggle task"), o.checked = !!s.attrs.checked, o.disabled = !S(this, x, Z).call(this);
  const l = document.createElement("div");
  l.className = "task-content", u.append(o, l), u.dataset.checked = o.checked ? "true" : "false";
  const a = () => {
    if (!S(this, x, Z).call(this)) {
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
    update: (c) => c.type !== s.type || c.attrs.checked === null ? !1 : (s = c, o.checked = !!c.attrs.checked, o.disabled = !S(this, x, Z).call(this), u.dataset.checked = o.checked ? "true" : "false", !0),
    stopEvent: (c) => c.target === o,
    destroy: () => o.removeEventListener("change", a)
  };
}, mr = function() {
  this.renderRoot.querySelectorAll('li[data-task] > input[type="checkbox"]').forEach((t) => {
    t.disabled = !S(this, x, Z).call(this);
  });
}, Ln = new WeakMap(), gr = function(t) {
  if (!b(this, C)) return;
  const { doc: r, schema: i } = b(this, C).state, u = Ve(r);
  if (u !== this.value) return;
  let s = Math.max(0, Math.min(t, r.content.size)), o = r.resolve(s);
  if (!o.parent.inlineContent) {
    const a = I.findFrom(o, 1, !0) ?? I.findFrom(o, -1, !0);
    if (!a) return;
    s = a.from, o = r.resolve(s);
  }
  let l = "WYSIWYGCURSORMARKER";
  for (; u.includes(l); ) l += "X";
  try {
    const a = i.text(l, o.marks()), c = b(this, C).state.tr.insert(
      s,
      a
    ).doc, f = Ve(c), h = f.indexOf(l);
    return h < 0 ? void 0 : f.slice(0, h) + f.slice(h + l.length) === u ? h : void 0;
  } catch {
    return;
  }
}, va = function(t, r) {
  const i = Math.max(0, Math.min(r, t.length)), u = lr(t), s = t.length ? Math.round(i / t.length * u.content.size) : 0;
  let o = "WYSIWYGCURSORMARKER";
  for (; t.includes(o); ) o += "X";
  try {
    const l = t.slice(0, i) + o + t.slice(i), a = lr(l);
    let c;
    if (a.descendants((p, d) => {
      if (c !== void 0) return !1;
      if (!p.isText) return !0;
      const m = p.text?.indexOf(o) ?? -1;
      return m < 0 ? !0 : (c = d + m, !1);
    }), c === void 0) return s;
    const f = Ve(u);
    return Ve(a).replaceAll(o, "") !== f ? s : Math.min(c, u.content.size);
  } catch {
    return s;
  }
}, Ia = function(t) {
  const r = this.renderRoot.querySelector(
    "#document-source"
  );
  if (!r) return;
  const i = Math.max(
    0,
    Math.min(t ?? r.selectionStart, r.value.length)
  );
  r.focus(), r.setSelectionRange(i, i), S(this, x, Ra).call(this, r, i);
}, Ra = function(t, r) {
  if (t.clientWidth <= 0 || t.clientHeight <= 0) return;
  const i = t.ownerDocument.defaultView;
  if (!i) return;
  const u = i.getComputedStyle(t), s = t.ownerDocument.createElement("div"), o = t.ownerDocument.createElement("span");
  s.className = "source-caret-mirror", o.className = "source-caret-marker";
  const l = [
    "direction",
    "font-family",
    "font-size",
    "font-style",
    "font-variant",
    "font-weight",
    "letter-spacing",
    "line-height",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "tab-size",
    "text-align",
    "text-indent",
    "text-transform",
    "white-space",
    "word-break",
    "overflow-wrap"
  ];
  for (const a of l)
    s.style.setProperty(a, u.getPropertyValue(a));
  s.style.position = "fixed", s.style.left = "-10000px", s.style.top = "0", s.style.boxSizing = "border-box", s.style.width = `${t.clientWidth}px`, s.style.height = "auto", s.style.minHeight = "0", s.style.overflow = "hidden", s.style.visibility = "hidden", s.style.margin = "0", s.textContent = t.value.slice(0, r), o.textContent = "​", s.append(o), t.ownerDocument.body.append(s);
  try {
    const a = s.getBoundingClientRect(), c = o.getBoundingClientRect(), f = Number.parseFloat(u.fontSize) || 16, h = Number.parseFloat(u.lineHeight) || f * 1.2, d = c.top - a.top - (t.clientHeight - h) / 2, m = Math.max(0, t.scrollHeight - t.clientHeight);
    t.scrollTop = Math.max(0, Math.min(d, m));
  } finally {
    s.remove();
  }
}, Pa = function(t) {
  if (!b(this, C)) return;
  const { doc: r } = b(this, C).state, i = Math.max(0, Math.min(t, r.content.size)), u = I.near(r.resolve(i), 1);
  b(this, C).dispatch(b(this, C).state.tr.setSelection(u));
  try {
    b(this, C).focus();
  } catch {
    b(this, C).dom.focus();
  }
  S(this, x, $a).call(this, u.head);
}, $a = function(t) {
  if (!b(this, C)) return;
  const r = this.renderRoot.querySelector("#editor-mount");
  if (!(!r || r.clientHeight <= 0))
    try {
      const i = b(this, C).coordsAtPos(t), u = r.getBoundingClientRect(), s = (i.top + i.bottom) / 2, o = u.top + r.clientHeight / 2, l = r.scrollTop + s - o, a = Math.max(0, r.scrollHeight - r.clientHeight);
      r.scrollTop = Math.max(0, Math.min(l, a));
    } catch {
    }
}, za = function(t) {
  return t.button !== 1 ? !1 : S(this, x, Zi).call(this, t);
}, Ba = function(t) {
  return t.button !== 0 || !t.ctrlKey && !t.metaKey ? !1 : S(this, x, Zi).call(this, t);
}, Zi = function(t) {
  const r = t.composedPath().find((i) => i instanceof HTMLAnchorElement);
  return r?.href ? (t.preventDefault(), window.open(r.href, "_blank", "noopener,noreferrer"), !0) : !1;
}, La = function(t) {
  const r = t.composedPath().find((u) => u instanceof HTMLImageElement), i = r?.dataset.source;
  return !r || !i || this.dispatchEvent(
    new CustomEvent("image-activate", {
      detail: {
        source: i,
        displaySource: r.currentSrc || r.src
      },
      bubbles: !0,
      composed: !0
    })
  ), !1;
}, Vn = new WeakMap(), qn = new WeakMap(), Hn = new WeakMap(), Gi = function(t, r, i = t.selectionStart, u = t.selectionEnd) {
  t.value = t.value.slice(0, i) + r + t.value.slice(u);
  const s = i + r.length;
  t.setSelectionRange(s, s), this.documentSourceValue = t.value, this.value = t.value, S(this, x, hr).call(this, "source-edit");
}, Un = new WeakMap(), Wn = new WeakMap(), pn.formAssociated = !0, pn.properties = {
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
  preventExtraEmptyParagraphs: {
    type: Boolean,
    attribute: "prevent-extra-empty-paragraphs",
    reflect: !0
  },
  codeHighlighter: { attribute: !1 },
  themeCss: { attribute: !1 },
  blockSourceOpen: { state: !0 },
  blockSourceValue: { state: !0 }
}, pn.styles = L1;
let Vi = pn;
customElements.get("wysiwyg-markdown") || customElements.define("wysiwyg-markdown", Vi);
export {
  Vi as WysiwygMarkdownElement,
  z as markdownSchema,
  lr as parseMarkdown,
  Ve as serializeMarkdown
};
//# sourceMappingURL=wysiwyg-markdown.js.map
