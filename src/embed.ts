// Embed script: injects main.js into the target page's head
(() => {
	const src = import.meta.env.VITE_MAIN_JS_URL as string;
	const script = document.createElement("script");
	script.src = src;
	document.head.appendChild(script);
})();
