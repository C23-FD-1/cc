interface Input {
	job_position: string;
	gender: string;
}

export default function oneHotEncode({ job_position, gender }: Input) {
	job_position = job_position.replace(/\s/g, "");
	job_position = job_position.replace("/", "");

	const karyawan = [
		/(.*(?:KARYAWAN).*)/,
		/(.*(?:BURUH).*)/,
		/PILOT/,
		/PELAUT/,
		/PETANIPEKEBUN/,
		/PETERNAK/,
		/NELAYANPERIKANAN/,
		/SOPIR/,
		/AKUNTAN/,
		/TRANSPORTASI/,
		/PENATARIAS/,
		/PENATARAMBUT/,
		/PENATABUSANA/,
		/PENGEMUDI/,
		/PENYIARTELEVISI/,
		/PENYIARRADIO/,
	];

	const tidak_kerja = [/(.*(?:TIDAK).*)/, /(.*(?:BELUM).*)/, /PENSIUNAN/, /PENSIUN/];

	const pelajar = [/(.*(?:PELAJAR).*)/];

	const wiraswasta = [
		/(.*(?:SWASTA).*)/,
		/(.*(?:WIRA).*)/,
		/PERDAGANGAN/,
		/INDUSTRI/,
		/KONSTRUKSI/,
		/PEDAGANG/,
		/WIASRWASTA/,
	];

	const spesialis = [
		/(.*(?:TUKANG).*)/,
		/GURU/,
		/DOSEN/,
		/BIDAN/,
		/DOKTER/,
		/WARTAWAN/,
		/APOTEKER/,
		/PERAWAT/,
		/PENGACARA/,
		/PENELITI/,
		/PARAJI/,
		/KONSULTAN/,
		/PERANCANGBUSANA/,
		/HAKIM/,
		/ARSITEK/,
		/PENTERJEMAH/,
		/JURUMASAK/,
		/MEKANIK/,
		/NOTARIS/,
	];

	const pns = [
		/(.*(?:BUMN).*)/,
		/(.*(?:BUMD).*)/,
		/(.*(?:ANGGOTA).*)/,
		/PERANGKATDESA/,
		/PEGAWAINEGERISIPIL/,
		/KEPOLISIANRI/,
		/GUBERNUR/,
		/TENTARANASIONALINDONESIA/,
		/KEPALADESA/,
		/WALIKOTA/,
		/BUPATI/,
		/DUTABESAR/,
	];

	const rumahtangga = [/(.*(?:RUMAH).*)/];

	const lainnya = [
		/(.*(?:LAIN).*)/,
		/^[A-Z0-9]{0,3}$/,
		/SENIMAN/,
		/TABIB/,
		/USTADZMUBALIGH/,
		/OHTERS/,
		/OTHERS/,
		/PASTUR/,
		/PARANORMAL/,
		/PIALANG/,
		/IMAMMASJID/,
		/PENDETA/,
		/BIARAWATI/,
	];

	job_position = job_position.replace(new RegExp(lainnya.map((regex) => regex.source).join("|"), "gi"), "LAINNYA");
	job_position = job_position.replace(new RegExp(pns.map((regex) => regex.source).join("|"), "gi"), "PEGAWAI_NS");
	job_position = job_position.replace(new RegExp(pelajar.map((regex) => regex.source).join("|"), "gi"), "PELAJAR");
	job_position = job_position.replace(new RegExp(karyawan.map((regex) => regex.source).join("|"), "gi"), "KARYAWAN");
	job_position = job_position.replace(
		new RegExp(wiraswasta.map((regex) => regex.source).join("|"), "gi"),
		"WIRASWASTA"
	);
	job_position = job_position.replace(new RegExp(spesialis.map((regex) => regex.source).join("|"), "gi"), "SPESIALIS");
	job_position = job_position.replace(
		new RegExp(rumahtangga.map((regex) => regex.source).join("|"), "gi"),
		"RUMAH_TANGGA"
	);
	job_position = job_position.replace(
		new RegExp(tidak_kerja.map((regex) => regex.source).join("|"), "gi"),
		"TIDAK_KERJA"
	);

	const hashJob: any = {
		job_position_LAINNYA: 0,
		job_position_PEGAWAI_NS: 0,
		job_position_PELAJAR: 0,
		job_position_KARYAWAN: 0,
		job_position_WIRASWASTA: 0,
		job_position_SPESIALIS: 0,
		job_position_RUMAH_TANGGA: 0,
		job_position_TIDAK_KERJA: 0,
	};

	hashJob["job_position_" + job_position] = 1;

	const hashGender: any = {
		gender_Male: 0,
		gender_Female: 0,
		gender_None: 0,
	};

	hashGender["gender_" + gender] = 1;

	return [hashGender, hashJob];
}
