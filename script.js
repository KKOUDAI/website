const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const siteHeader = document.querySelector(".site-header");
const siteNav = document.getElementById("primaryNav");
const contactForm = document.querySelector(".contact-form");
const navBackdrop = document.getElementById("navBackdrop");
const blogToggle = document.getElementById("blogToggle");
const blogDrawer = document.getElementById("blogDrawer");
const blogDrawerInner = blogDrawer ? blogDrawer.querySelector(".blog-drawer__inner") : null;
const blogClose = document.getElementById("blogClose");
const blogEntries = blogDrawer ? Array.from(blogDrawer.querySelectorAll(".blog-entry")) : [];
const blogDetail = document.getElementById("blogDetail");
const blogDetailMeta = document.getElementById("blogDetailMeta");
const blogDetailTitle = document.getElementById("blogDetailTitle");
const blogDetailContent = document.getElementById("blogDetailContent");
const blogDetailBack = document.getElementById("blogDetailBack");
const toTopLink = document.querySelector(".to-top");
const yearElem = document.getElementById("year");

let closeNavMenu = null;
let lastFocusedElement = null;
let activeBlogPost = null;

const blogPosts = {
  "fps-ippg": {
    meta: "2025.03.02 · Research Log",
    title: "FPS が iPPG 測定を左右する理由",
    content: [
      {
        type: "p",
        text: 'iPPG はスマートフォンなどのカメラで脈波を推定する技術です。指先をセンサーに当てずとも血流の変化を取得できるため、セルフケアや在宅ヘルスケアの選択肢として注目されています。',
      },
      {
        type: "p",
        text: 'しかし、撮影時間とフレームレートのどちらを優先すべきかという素朴な疑問には明確な答えがありませんでした。そこで 240 FPS のスローモーション撮影をベースに、撮影時間と FPS を変化させながら RQA 指標 (DET / L / E) を比較しました。',
      },
      {
        type: "h4",
        text: "実験で試したこと",
      },
      {
        type: "ul",
        items: [
          "20 代の健常者 20 名の指先を iPad mini で約 5 分間撮影",
          "各フレームから指先領域の赤成分を抽出して時系列データを作成",
          "RQA 指標を用いて複雑性と予測しやすさを評価",
        ],
      },
      {
        type: "p",
        text: '結果は明快で、どの指標でも FPS の影響が測定時間を大きく上回りました。長時間撮影しても品質の向上は限定的で、むしろ FPS を下げると指標値が大きく変動します。短時間でも高 FPS を確保するという設計方針が見えたのが最大の収穫でした。',
      },
      {
        type: "p",
        text: 'この知見をアプリに落とし込む際は、ユーザーが簡単に高 FPS 撮影を選択できる UI を用意すること、そして撮影時間は負担にならない範囲でガイドすれば十分であることを意識しています。',
      },
    ],
  },
  "weekend-prototype": {
    meta: "2025.01.29 · Personal",
    title: "週末プロトタイピングで見つけた習慣設計",
    content: [
      {
        type: "p",
        text: '休日に 6〜8 時間だけ時間を確保し、毎回テーマを決めて SwiftUI のプロトタイプを作るというチャレンジを続けています。短期集中で作ると、プロダクトの核心をどこに置くかを瞬時に判断する力が鍛えられます。',
      },
      {
        type: "p",
        text: '最近は “生活リズムの可視化” をテーマに、起床時間と気分のログをタイルで表示する UI を試作しました。色の変化だけで調子を振り返れるので、翌週の予定調整がスムーズになったというフィードバックをもらっています。',
      },
      {
        type: "h4",
        text: "プロトタイピングで意識していること",
      },
      {
        type: "ul",
        items: [
          '1 日で作れる MVP の範囲を事前に言語化する',
          '実装後すぐに TestFlight で共有し、操作動画もセットで送る',
          '気づきを Notion に蓄積し、次のプロダクトアイデアの種にする',
        ],
      },
      {
        type: "p",
        text: '週末だけでも「作って試す」サイクルを持っていると、平日に出会った課題をすぐ形にできる安心感があります。小さく開始しても、継続が積み重なると自分なりの習慣設計が見えてきます。',
      },
    ],
  },
};

function showBlogList(options = {}) {
  const { restoreFocus = false } = options;
  const target = activeBlogPost?.trigger;
  if (blogDrawer) {
    blogDrawer.classList.remove("blog-drawer--detail");
  }
  if (blogDetail) {
    blogDetail.hidden = true;
  }
  if (blogDrawerInner) {
    blogDrawerInner.scrollTop = 0;
  }
  activeBlogPost = null;
  if (restoreFocus && target && typeof target.focus === "function") {
    target.focus({ preventScroll: true });
  }
}

function closeBlogDrawer() {
  if (!blogDrawer || !document.body.classList.contains("blog-open")) return;
  showBlogList();
  document.body.classList.remove("blog-open");
  blogDrawer.setAttribute("aria-hidden", "true");
  if (blogToggle) {
    blogToggle.setAttribute("aria-expanded", "false");
    blogToggle.setAttribute("aria-label", "ブログメニューを開く");
    blogToggle.classList.remove("blog-toggle--active");
  }

  const restoreTarget = lastFocusedElement;
  lastFocusedElement = null;
  if (restoreTarget && typeof restoreTarget.focus === "function") {
    restoreTarget.focus({ preventScroll: true });
  }
}

function openBlogDrawer() {
  if (!blogDrawer || document.body.classList.contains("blog-open")) return;
  if (typeof closeNavMenu === "function") {
    closeNavMenu();
  }

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  showBlogList();
  document.body.classList.add("blog-open");
  blogDrawer.setAttribute("aria-hidden", "false");
  if (blogToggle) {
    blogToggle.setAttribute("aria-expanded", "true");
    blogToggle.setAttribute("aria-label", "ブログメニューを閉じる");
    blogToggle.classList.add("blog-toggle--active");
  }

  if (blogDrawerInner) {
    blogDrawerInner.scrollTop = 0;
  }

  if (blogClose) {
    blogClose.focus({ preventScroll: true });
  } else if (typeof blogDrawer.focus === "function") {
    blogDrawer.focus({ preventScroll: true });
  }
}

function renderBlogContent(blocks) {
  if (!blogDetailContent) return;
  blogDetailContent.innerHTML = "";
  blocks.forEach((block) => {
    if (block.type === "p") {
      const paragraph = document.createElement("p");
      paragraph.textContent = block.text;
      blogDetailContent.append(paragraph);
      return;
    }
    if (block.type === "h4") {
      const heading = document.createElement("h4");
      heading.textContent = block.text;
      blogDetailContent.append(heading);
      return;
    }
    if (block.type === "ul" && Array.isArray(block.items)) {
      const list = document.createElement("ul");
      block.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.append(li);
      });
      blogDetailContent.append(list);
    }
  });
}

function openBlogPost(slug, triggerElement) {
  const post = blogPosts[slug];
  if (!post || !blogDrawer || !blogDetail) return;
  activeBlogPost = { slug, trigger: triggerElement };
  blogDrawer.classList.add("blog-drawer--detail");
  blogDetail.hidden = false;
  if (blogDetailMeta) {
    blogDetailMeta.textContent = post.meta;
  }
  if (blogDetailTitle) {
    blogDetailTitle.textContent = post.title;
  }
  renderBlogContent(post.content);
  if (blogDrawerInner) {
    blogDrawerInner.scrollTop = 0;
  }
  if (blogDetailBack) {
    blogDetailBack.focus({ preventScroll: true });
  }
}

// Set current year in footer for quick maintenance
if (yearElem) {
  yearElem.textContent = new Date().getFullYear();
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = localStorage.getItem("codex-theme");

const applyTheme = (theme) => {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    root.removeAttribute("data-theme");
    themeToggle.textContent = "🌙";
  }
};

const initialTheme = storedTheme || (prefersDark.matches ? "dark" : "light");
applyTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("codex-theme", nextTheme);
  });
}

if (navToggle && siteHeader && siteNav) {
  const firstNavLink = siteNav.querySelector("a");

  const setNavState = (isOpen) => {
    siteHeader.classList.toggle("site-header--nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.classList.toggle("nav-open", isOpen);
    if (navBackdrop) {
      navBackdrop.hidden = !isOpen;
    }

    if (isOpen && firstNavLink) {
      firstNavLink.focus({ preventScroll: true });
    }
  };

  const closeNav = () => {
    if (!siteHeader.classList.contains("site-header--nav-open")) return;
    setNavState(false);
  };

  closeNavMenu = closeNav;

  navToggle.addEventListener("click", () => {
    if (document.body.classList.contains("blog-open")) {
      closeBlogDrawer();
    }
    const isOpen = siteHeader.classList.contains("site-header--nav-open");
    setNavState(!isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNav);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.classList.contains("site-header--nav-open")) return;
    const target = event.target;
    const isToggle = navToggle.contains(target);
    const isThemeToggle = themeToggle && themeToggle.contains(target);
    const isInsideNav = siteNav.contains(target);
    const isBackdrop = navBackdrop && navBackdrop.contains(target);
    if (isToggle || isThemeToggle || isInsideNav || isBackdrop) return;
    closeNav();
  });
}

if (blogToggle && blogDrawer) {
  blogToggle.addEventListener("click", () => {
    if (document.body.classList.contains("blog-open")) {
      closeBlogDrawer();
    } else {
      openBlogDrawer();
    }
  });
}

if (blogClose) {
  blogClose.addEventListener("click", () => {
    closeBlogDrawer();
  });
}

if (blogDrawer) {
  blogDrawer.addEventListener("click", (event) => {
    if (!document.body.classList.contains("blog-open") || !blogDrawerInner) return;
    if (blogDrawerInner.contains(event.target)) return;
    closeBlogDrawer();
  });
}

if (blogEntries.length) {
  blogEntries.forEach((entry) => {
    const slug = entry.dataset.post;
    if (!slug) return;
    entry.addEventListener("click", () => {
      openBlogPost(slug, entry);
    });
    entry.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openBlogPost(slug, entry);
    });
  });
}

if (blogDetailBack) {
  blogDetailBack.addEventListener("click", () => {
    showBlogList({ restoreFocus: true });
  });
}

if (toTopLink) {
  toTopLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (document.body.classList.contains("blog-open")) {
      closeBlogDrawer();
    }
    if (typeof closeNavMenu === "function") {
      closeNavMenu();
    }

    const canSmoothScroll = "scrollBehavior" in document.documentElement.style;
    if (canSmoothScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("blog-open")) {
    if (blogDrawer && blogDrawer.classList.contains("blog-drawer--detail")) {
      showBlogList({ restoreFocus: true });
      return;
    }
    closeBlogDrawer();
  }
});

document.addEventListener("focusin", (event) => {
  if (!document.body.classList.contains("blog-open") || !blogDrawer) return;
  if (blogDrawer.contains(event.target)) return;
  if (blogClose) {
    blogClose.focus({ preventScroll: true });
  } else if (typeof blogDrawer.focus === "function") {
    blogDrawer.focus({ preventScroll: true });
  }
});

// Provide smooth scroll fallback for browsers without native support
const supportsSmoothScroll = "scrollBehavior" in document.documentElement.style;

if (!supportsSmoothScroll) {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = anchor.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const topOffset = targetElement.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`お問い合わせ: ${name || "無記名"}`);
    const bodyLines = [
      "以下の内容でお問い合わせがありました。",
      "",
      `お名前: ${name || "未入力"}`,
      `メールアドレス: ${email || "未入力"}`,
      "",
      "メッセージ:",
      message || "(本文なし)",
    ];

    const mailtoLink = `mailto:kkoga2013@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailtoLink;
    contactForm.reset();
  });
}

prefersDark.addEventListener("change", (event) => {
  if (localStorage.getItem("codex-theme")) return;
  applyTheme(event.matches ? "dark" : "light");
});
