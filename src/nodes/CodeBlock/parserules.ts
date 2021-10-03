import type { ParseRule } from "prosemirror-model";

export default [

  /**
   * Gitlab
   * https://github.com/rouge-ruby/rouge
   */
  {
    tag: "div.highlighter-rouge", 
    preserveWhitespace: "full",
    getAttrs(dom: HTMLDivElement) { 
      let [match, lang] = /language-([a-z\/+#-.]*)/.exec(dom.className) || [];
      return match ? {lang} : {}
    }
  },

  /**
   * Github
   * https://github.com/github/linguist
   */
  { 
    tag: "div.highlight", 
    preserveWhitespace: "full",
    getAttrs(dom: HTMLDivElement) { 
      let [match, lang] = /highlight highlight-source-([a-z\/+#-.]*)/.exec(dom.className) || [];
      return match ? {lang} : {}
    }
  },

  /**
   * StackExchange+StackOverflow
   * https://meta.stackexchange.com/questions/353983/goodbye-prettify-hello-highlight-js-swapping-out-our-syntax-highlighter
   */
  {
    tag: "pre.hljs",
    preserveWhitespace: "full",
    getAttrs(dom: HTMLPreElement) {
      let [match, lang] = /hljs ([a-z\/+#-.]*)/.exec(dom.className) || /lang-([a-z\/+#-.]*)/.exec(dom.className) || [];
      return match ? {lang} : {}
    }
  },


  /**
   * Catch-all for highlightjs and prismjs.
   */
  {
    tag: "pre",
    preserveWhitespace: "full",
    getAttrs(dom: HTMLPreElement) {
      let className = `${dom.className} ${dom.firstElementChild?.className || ""}`; // concat with class of child code element
      let [match, lang] = /hljs ([a-z\/+#-.]*)/.exec(className) || /lang-([a-z\/+#-.]*)/.exec(className) || /language-([a-z\/+#-.]*)/.exec(className) || [];
      return match ? {lang} : {}
    }
  },


  /**
   * Catch-all catch-all.
   */
  {
    tag: "pre", 
    preserveWhitespace: "full"
  },

] as ParseRule[];