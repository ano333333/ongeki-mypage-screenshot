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

	await new Promise<void>((resolve) => {
		canvas.toBlob((blob) => {
			if (blob) {
				// FIXME: 使用デバイスがiOSか否かでwindow.openとダウンロードを分ける(user agentによる判別がうまくいかなかった)
				const url = URL.createObjectURL(blob);
				window.open(url, "_blank");
			}
			resolve();
		});
	});
}
