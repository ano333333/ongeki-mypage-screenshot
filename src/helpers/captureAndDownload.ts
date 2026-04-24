import html2canvas from "html2canvas";

/**
 * 指定要素をcanvas化してファイルをダウンロードする。
 * @param target キャプチャ対象要素
 * @param filename ダウンロードファイル名
 */
export async function captureAndDownload(
	target: HTMLElement,
	filename: string,
): Promise<void> {
	const canvas = await html2canvas(target);

	const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

	await new Promise<void>((resolve) => {
		canvas.toBlob((blob) => {
			if (blob) {
				const url = URL.createObjectURL(blob);
				if (isIOS) {
					window.open(url, "_blank");
				} else {
					const a = document.createElement("a");
					a.href = url;
					a.download = filename;
					a.style.display = "none";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(url);
				}
			}
			resolve();
		});
	});
}
