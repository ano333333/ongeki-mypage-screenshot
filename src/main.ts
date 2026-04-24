// Bookmarklet entry point
import html2canvas from "html2canvas";

(() => {
	try {
		// 1. URL チェック
		if (
			!window.location.href.startsWith(
				"https://ongeki-net.com/ongeki-mobile/record/playlog/",
			)
		) {
			alert(
				"エラー: このページでは使用できません。プレイ履歴ページで起動してください。",
			);
			return;
		}

		// メンテナンス中チェック
		if (document.documentElement.innerHTML.includes("定期メンテナンス中です")) {
			throw new Error("定期メンテナンス中です");
		}

		// 2. コンテナ要素を取得
		const container = document.querySelector("div.container3");
		if (!container) {
			alert("エラー: コンテナ要素が見つかりません。");
			return;
		}

		// 3. プレイ履歴要素を検索してボタンを差し替え
		const playlogItems = container.querySelectorAll("div.m_10");
		if (playlogItems.length === 0) {
			alert("エラー: プレイ履歴が見つかりません。");
			return;
		}

		// 各要素の選択状態を管理する配列
		const selectionStates: boolean[] = new Array(playlogItems.length).fill(
			false,
		);

		playlogItems.forEach((item, index) => {
			const submitButton = item.querySelector('button[type="submit"]');
			if (submitButton) {
				// 新しいボタンを作成
				const selectButton = document.createElement("button");
				selectButton.type = "button";

				// img の class を取得して p 要素に適用
				const img = submitButton.querySelector("img");
				if (img && img.className) {
					const p = document.createElement("p");
					p.className = img.className;
					p.textContent = "選択する";
					selectButton.appendChild(p);
				} else {
					selectButton.textContent = "選択する";
				}

				// クリックハンドラを追加
				selectButton.addEventListener("click", () => {
					selectionStates[index] = !selectionStates[index];
					const p = selectButton.querySelector("p");
					if (p) {
						p.textContent = selectionStates[index] ? "選択済み" : "選択する";
					} else {
						selectButton.textContent = selectionStates[index]
							? "選択済み"
							: "選択する";
					}
				});

				// ボタンを差し替え
				submitButton.parentNode?.replaceChild(selectButton, submitButton);
			}
		});

		// 4. キャプチャボタンを追加
		const captureButton = document.createElement("button");
		captureButton.textContent = "キャプチャする";
		captureButton.style.position = "fixed";
		captureButton.style.top = "10px";
		captureButton.style.left = "10px";
		captureButton.style.zIndex = "10000";
		captureButton.style.padding = "10px 20px";
		captureButton.style.backgroundColor = "#007bff";
		captureButton.style.color = "white";
		captureButton.style.border = "none";
		captureButton.style.borderRadius = "5px";
		captureButton.style.cursor = "pointer";
		captureButton.style.fontSize = "16px";
		captureButton.style.fontWeight = "bold";

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

				const contentDiv = document.createElement("div");
				hiddenContainer.appendChild(contentDiv);

				// 選択済みの要素を追加
				selectedItems.forEach((item, index) => {
					const clonedItem = item.cloneNode(true) as Element;
					contentDiv.appendChild(clonedItem);

					// 最後の要素以外は区切り線を追加
					if (index < selectedItems.length - 1) {
						const clearfix = document.createElement("div");
						clearfix.className = "clearfix";
						contentDiv.appendChild(clearfix);

						const hr = document.createElement("hr");
						hr.className = "gray_line";
						contentDiv.appendChild(hr);
					}
				});

				// html2canvas でキャプチャ
				const canvas = await html2canvas(contentDiv);

				// 画像をダウンロード
				const timestamp = new Date()
					.toISOString()
					.replace(/[:.]/g, "-")
					.slice(0, -5);
				const filename = `ongeki-playlog-${timestamp}.png`;

				canvas.toBlob((blob) => {
					if (blob) {
						const url = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = url;
						a.download = filename;
						a.style.display = "none";
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						URL.revokeObjectURL(url);
					}

					// 隠し div を削除
					document.body.removeChild(hiddenContainer);

					// 5. ページをリロード
					window.location.reload();
				});
			} catch (error) {
				const errorMessage = `キャプチャ中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`;
				alert(errorMessage);
				console.error(errorMessage, error);
				window.location.reload();
			}
		});

		document.body.appendChild(captureButton);
	} catch (error) {
		const errorMessage = `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`;
		alert(errorMessage);
		console.error(errorMessage, error);
		window.location.reload();
	}
})();
