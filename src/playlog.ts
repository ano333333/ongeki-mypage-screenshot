import { captureAndDownload } from "./helpers/captureAndDownload";
import { createCaptureButton } from "./helpers/createCaptureButton";
import { deepCloneWithStyles } from "./helpers/deepCloneWithStyles";

export function downloadPlaylog() {
	// 1. コンテナ要素を取得
	const container = document.querySelector("div.container3");
	if (!container) {
		alert("エラー: コンテナ要素が見つかりません。");
		return;
	}

	// 2. プレイ履歴要素を検索してタッチ選択を設定する
	const playlogItems = container.querySelectorAll("div.m_10");
	if (playlogItems.length === 0) {
		alert("エラー: プレイ履歴が見つかりません。");
		return;
	}

	// 各要素の選択状態を管理する配列
	const selectionStates: boolean[] = new Array(playlogItems.length).fill(false);

	playlogItems.forEach((item, index) => {
		(item as HTMLElement).style.cursor = "pointer";
		item.addEventListener("click", () => {
			selectionStates[index] = !selectionStates[index];
			(item as HTMLElement).style.background = selectionStates[index]
				? "rgba(173, 216, 230, 0.5)"
				: "";
		});
	});

	// 3. キャプチャボタンを追加
	const captureButton = createCaptureButton();

	captureButton.addEventListener("click", async () => {
		try {
			// 選択済みの要素を集める
			const selectedItems: Element[] = [];
			playlogItems.forEach((item, index) => {
				if (selectionStates[index]) {
					selectedItems.push(item);
				}
			});

			if (selectedItems.length === 0) {
				alert("選択された項目がありません。");
				return;
			}

			// 隠し div を作成
			const hiddenContainer = document.createElement("div");
			hiddenContainer.style.position = "absolute";
			hiddenContainer.style.left = "-9999px";
			hiddenContainer.style.top = "0";
			document.body.appendChild(hiddenContainer);

			// div.m_15 を取得
			const m15 = document.querySelector("div.m_15");
			if (!m15) {
				alert("エラー: キャプチャ対象要素が見つかりません。");
				document.body.removeChild(hiddenContainer);
				return;
			}

			// container3 をディープコピーして内側を選択済みアイテムに差し替え
			const clonedContainer = deepCloneWithStyles(container);
			clonedContainer.innerHTML = "";
			selectedItems.forEach((item, index) => {
				const clonedItem = deepCloneWithStyles(item as HTMLElement);
				clonedItem.style.background = "";
				clonedItem.style.cursor = "";
				clonedContainer.appendChild(clonedItem);

				// 最後の要素以外は区切り線を追加
				if (index < selectedItems.length - 1) {
					const clearfix = document.createElement("div");
					clearfix.className = "clearfix";
					clonedContainer.appendChild(clearfix);

					const hr = document.createElement("hr");
					hr.className = "gray_line";
					clonedContainer.appendChild(hr);
				}
			});

			// wrapper 要素を作成し m_15 と container3 を兄弟として追加
			const wrapper = document.createElement("div");
			wrapper.className = "wrapper main_wrapper t_c";
			wrapper.appendChild(deepCloneWithStyles(m15));
			wrapper.appendChild(clonedContainer);
			hiddenContainer.appendChild(wrapper);

			const timestamp = new Date()
				.toISOString()
				.replace(/[:.]/g, "-")
				.slice(0, -5);
			const filename = `ongeki-playlog-${timestamp}.png`;

			await captureAndDownload(wrapper, filename);

			// 隠し div を削除
			document.body.removeChild(hiddenContainer);

			// 4. ページをリロード
			window.location.reload();
		} catch (error) {
			const errorMessage = `キャプチャ中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`;
			alert(errorMessage);
			console.error(errorMessage, error);
			window.location.reload();
		}
	});

	document.body.appendChild(captureButton);
}
