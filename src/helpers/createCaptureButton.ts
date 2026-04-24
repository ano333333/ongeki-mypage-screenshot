export function createCaptureButton(): HTMLButtonElement {
	const button = document.createElement("button");
	button.textContent = "キャプチャする";
	button.style.position = "fixed";
	button.style.top = "10px";
	button.style.left = "10px";
	button.style.zIndex = "10000";
	button.style.padding = "10px 20px";
	button.style.backgroundColor = "#007bff";
	button.style.color = "white";
	button.style.border = "none";
	button.style.borderRadius = "5px";
	button.style.cursor = "pointer";
	button.style.fontSize = "16px";
	button.style.fontWeight = "bold";
	return button;
}
