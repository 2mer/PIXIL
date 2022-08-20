export default function loadImage(url: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.src = url;

		const handleImageLoad = () => {
			resolve(image);
		};

		if (image.complete) {
			handleImageLoad();
		} else {
			image.onload = handleImageLoad;
			image.onerror = reject;
		}
	});
}
