export interface IRow {
	""?: string;
	uid?: string;
	is_scammer?: number;
	trx_date: string | number;
	report_date: string | number;
	registereddate: string | number;
	birthday: string | number;
	gender: string;
	source?: string;
	job_position: string;
	is_verified: boolean;
	aqc_freq_prepaid_mobile: number;
	aqc_mean_prepaid_mobile_amount: number;
	aqc_freq_topup: number;
	aqc_freq_topup_within_7d: number;
	aqc_mean_topup_amount: number;
	aqc_mean_topup_amount_7d: number;
	aqc_mean_topup_amount_30d: number;
	aqc_mean_topup_amount_90d: number;
	aqc_total_topup_amount_7d: number;
	aqc_total_topup_amount_90d: number;
	aqc_freq_x2x: number;
	aqc_freq_x2x_within_60d: number;
	aqc_freq_x2x_within_90d: number;
	aqc_mean_x2x_amount: number;
	aqc_mean_x2x_amount_7d: number;
	aqc_mean_x2x_amount_30d: number;
	aqc_mean_x2x_amount_60d: number;
	aqc_mean_x2x_amount_90d: number;
	aqc_total_x2x_amount: number;
	aqc_total_x2x_amount_7d: number;
	aqc_total_x2x_amount_30d: number;
	aqc_total_x2x_amount_60d: number;
	aqc_total_x2x_amount_90d: number;
	dormancy_max_gmt_pay_diff_days: number;
	dormancy_mean_gmt_pay_diff_days: number;
	dormancy_count_trx: number;
	kyc_total_failed: number;
	kyc_total_revoked: number;
	avg_topup_weight_1: number;
	avg_x2x_weight_1: number;
	avg_other_weight_1: number;
	centrality_outdegree_p2p: number;
	centrality_indegree_p2p: number;
	centrality_undirected_p2p: number;
	centrality_outdegree_sendmoney: number;
}

export interface IJob {
	job_position_KARYAWAN: number;
	job_position_LAINNYA: number;
	job_position_PEGAWAI_NS: number;
	job_position_PELAJAR: number;
	job_position_RUMAH_TANGGA: number;
	job_position_SPESIALIS: number;
	job_position_TIDAK_KERJA: number;
	job_position_WIRASWASTA: number;
}

export interface IGender {
	gender_Male: number;
	gender_Female: number;
	gender_None: number;
}

// export interface ISource {
// 	source_CS_REPORT_SCAMMER: number;
// 	source_CS_REPORT_VICTIM: number;
// 	source_INCOMPLETE_CS_REPORT_SCAMMER: number;
// 	source_INCOMPLETE_CS_REPORT_VICTIM: number;
// }

export interface IEncodedRow extends IJob, IGender {
	trx_date: number;
	report_date: number;
	registereddate: number;
	birthday: number;
	is_verified: number;
	aqc_freq_prepaid_mobile: number;
	aqc_mean_prepaid_mobile_amount: number;
	aqc_freq_topup: number;
	aqc_freq_topup_within_7d: number;
	aqc_mean_topup_amount: number;
	aqc_mean_topup_amount_7d: number;
	aqc_mean_topup_amount_30d: number;
	aqc_mean_topup_amount_90d: number;
	aqc_total_topup_amount_7d: number;
	aqc_total_topup_amount_90d: number;
	aqc_freq_x2x: number;
	aqc_freq_x2x_within_60d: number;
	aqc_freq_x2x_within_90d: number;
	aqc_mean_x2x_amount: number;
	aqc_mean_x2x_amount_7d: number;
	aqc_mean_x2x_amount_30d: number;
	aqc_mean_x2x_amount_60d: number;
	aqc_mean_x2x_amount_90d: number;
	aqc_total_x2x_amount: number;
	aqc_total_x2x_amount_7d: number;
	aqc_total_x2x_amount_30d: number;
	aqc_total_x2x_amount_60d: number;
	aqc_total_x2x_amount_90d: number;
	dormancy_max_gmt_pay_diff_days: number;
	dormancy_mean_gmt_pay_diff_days: number;
	dormancy_count_trx: number;
	kyc_total_failed: number;
	kyc_total_revoked: number;
	avg_topup_weight_1: number;
	avg_x2x_weight_1: number;
	avg_other_weight_1: number;
	centrality_outdegree_p2p: number;
	centrality_indegree_p2p: number;
	centrality_undirected_p2p: number;
	centrality_outdegree_sendmoney: number;
}
