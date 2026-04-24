import { captureAndDownload } from "./helpers/captureAndDownload";
import { createCaptureButton } from "./helpers/createCaptureButton";
import { deepCloneWithStyles } from "./helpers/deepCloneWithStyles";

export function downloadRanking() {
	// 1. ランキング行を取得し選択状態を管理する
	const rankingTbody = document.querySelector(
		"div.ranking_block table table tbody",
	);
	if (!rankingTbody) {
		alert("エラー: ランキングテーブルが見つかりません。");
		return;
	}

	const rows = Array.from(rankingTbody.querySelectorAll("tr"));
	if (rows.length === 0) {
		alert("エラー: ランキング行が見つかりません。");
		return;
	}

	const selectionStates: boolean[] = new Array(rows.length).fill(false);

	rows.forEach((row, index) => {
		row.style.cursor = "pointer";
		row.addEventListener("click", () => {
			selectionStates[index] = !selectionStates[index];
			row.style.background = selectionStates[index]
				? "rgba(173, 216, 230, 0.5)"
				: "white";
		});
	});

	// 2. キャプチャボタンを追加
	const captureButton = createCaptureButton();

	captureButton.addEventListener("click", async () => {
		try {
			const selectedRows = rows.filter((_, index) => selectionStates[index]);

			if (selectedRows.length === 0) {
				alert("選択された行がありません。");
				return;
			}

			// 隠しdivを作成
			const hiddenContainer = document.createElement("div");
			hiddenContainer.style.position = "absolute";
			hiddenContainer.style.left = "-9999px";
			hiddenContainer.style.top = "0";
			document.body.appendChild(hiddenContainer);

			// 各要素を取得（兄弟関係）
			const container3 = document.querySelector("div.container3");
			const containerP15 = document.querySelector("div.container.p_15");
			const borderBlock = document.querySelector(
				"div.border_block.m_15.p_5.t_l",
			);
			const rankingBlock = document.querySelector("div.ranking_block");

			for (const el of [container3, containerP15, borderBlock, rankingBlock]) {
				if (!el) {
					alert("エラー: キャプチャ対象要素が見つかりません。");
					document.body.removeChild(hiddenContainer);
					return;
				}
			}

			// rankingBlockはディープコピーして内側のtbodyを選択行に差し替え
			const clonedRankingBlock = deepCloneWithStyles(rankingBlock!);
			const clonedInnerTbody =
				clonedRankingBlock.querySelector("table table tbody");
			if (!clonedInnerTbody) {
				alert("エラー: クローンのtbodyが見つかりません。");
				document.body.removeChild(hiddenContainer);
				return;
			}
			clonedInnerTbody.innerHTML = "";
			selectedRows.forEach((row) => {
				const clonedRow = deepCloneWithStyles(row) as HTMLTableRowElement;
				clonedRow.style.background = "";
				clonedRow.style.cursor = "";
				clonedInnerTbody.appendChild(clonedRow);
			});

			// wrapper要素を作成し4つを兄弟として追加
			const wrapper = document.createElement("div");
			wrapper.className = "wrapper main_wrapper t_c";
			wrapper.appendChild(deepCloneWithStyles(container3!));
			wrapper.appendChild(deepCloneWithStyles(containerP15!));
			wrapper.appendChild(deepCloneWithStyles(borderBlock!));
			wrapper.appendChild(clonedRankingBlock);
			hiddenContainer.appendChild(wrapper);

			const timestamp = new Date()
				.toISOString()
				.replace(/[:.]/g, "-")
				.slice(0, -5);
			const filename = `ongeki-ranking-${timestamp}.png`;

			await captureAndDownload(wrapper, filename);

			document.body.removeChild(hiddenContainer);
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
