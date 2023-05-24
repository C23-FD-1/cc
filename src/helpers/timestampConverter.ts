export default function timestampConverter(dateString: string) {
	const [day, month, year] = dateString.split("/");

	return Math.round(new Date(+year, +month - 1, +day).getTime() / (24 * 60 * 60 * 1000));
}
