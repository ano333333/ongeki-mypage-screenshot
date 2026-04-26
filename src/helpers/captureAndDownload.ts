import html2canvas from "html2canvas";

/**
 * 指定要素をcanvas化してファイルをダウンロードする。
 * @param target キャプチャ対象要素
 * @param filename ダウンロードファイル名
 */
export async function captureAndDownload(
	target: HTMLElement,
	_: string,
): Promise<void> {
	const canvas = await html2canvas(target);

	const dataUrl = canvas.toDataURL("image/png");
	const newWindow = window.open();
	if (newWindow) {
		newWindow.document.write(`<img src="${dataUrl}" style="width:100%;">`);
	} else {
		alert("ポップアップがブロックされました。設定を許可してください。");
	}
}
