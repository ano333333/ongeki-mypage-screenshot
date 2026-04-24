/**
 * DOM要素のタグ・クラス・style属性・子要素を再帰的にコピーして新しい要素を返す。
 */
export function deepCloneWithStyles(el: Element): Element {
	const clone = document.createElement(el.tagName.toLowerCase());
	// 全属性をコピー（src, href, class等）
	for (const attr of Array.from(el.attributes)) {
		clone.setAttribute(attr.name, attr.value);
	}
	// インラインstyleをコピー（attributeのstyleを上書き）
	const style = (el as HTMLElement).style;
	for (let i = 0; i < style.length; i++) {
		const prop = style[i];
		(clone as HTMLElement).style.setProperty(
			prop,
			style.getPropertyValue(prop),
		);
	}
	for (const child of Array.from(el.childNodes)) {
		if (child.nodeType === Node.TEXT_NODE) {
			clone.appendChild(child.cloneNode(true));
		} else if (child.nodeType === Node.ELEMENT_NODE) {
			clone.appendChild(deepCloneWithStyles(child as Element));
		}
	}
	return clone;
}
