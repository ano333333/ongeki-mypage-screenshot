// Bookmarklet entry point
import { downloadPlaylog } from "./playlog";
import { downloadRanking } from "./ranking";

(() => {
	try {
		// メンテナンス中チェック
		if (document.documentElement.innerHTML.includes("定期メンテナンス中です")) {
			throw new Error("定期メンテナンス中です");
		} else if (
			window.location.href.startsWith(
				"https://ongeki-net.com/ongeki-mobile/record/playlog/",
			)
		) {
			downloadPlaylog();
		} else if (
			window.location.href.startsWith(
				"https://ongeki-net.com/ongeki-mobile/ranking/musicRankingDetail/",
			)
		) {
			downloadRanking();
		} else {
			alert(
				"エラー: このページでは使用できません。プレイ履歴またはランキング詳細ページで起動してください。",
			);
		}
	} catch (error) {
		const errorMessage = `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`;
		alert(errorMessage);
		console.error(errorMessage, error);
		window.location.reload();
	}
})();
