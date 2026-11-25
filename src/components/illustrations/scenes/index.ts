// Story id → vector scenes. Every story has its own scene file with a
// distinct setting, palette and motifs; all share the kit + Finish so they
// read as one illustrated library. Bundled PNGs (assets/images/stories/…)
// always take precedence over these when present.

import type { StoryScenes } from '../kit';
import { CHU_CUOI } from './chuCuoi';
import { CAY_KHE } from './cayKhe';
import { COC_KIEN_TROI } from './cocKienTroi';
import { MAI_AN_TIEM } from './maiAnTiem';
import { TAM_CAM } from './tamCam';
import { BANH_CHUNG_BANH_GIAY } from './banhChungBanhGiay';
import { TICH_CHU } from './tichChu';
import { SON_TINH_THUY_TINH } from './sonTinhThuyTinh';
import { THANH_GIONG } from './thanhGiong';
import { HO_GUOM } from './hoGuom';
import { NANG_TIEN_OC } from './nangTienOc';
import { SO_DUA } from './soDua';
import { SU_TICH_TRAU_CAU } from './suTichTrauCau';
import { RUA_VA_THO } from './ruaVaTho';
import { SU_TU_VA_CHUOT } from './suTuVaChuot';
import { QUA_VA_BINH_NUOC } from './quaVaBinhNuoc';
import { DOM_DOM_SOI_DUONG } from './domDomSoiDuong';
import { MAY_NHO_LAM_MUA } from './mayNhoLamMua';
import { THUYEN_GIAY_DAM_SEN } from './thuyenGiayDamSen';
import { NGOI_SAO_BE_TI } from './ngoiSaoBeTi';
import { ECH_CON_HAT_RU } from './echConHatRu';
import { DEN_ONG_SAO_CUA_BA } from './denOngSaoCuaBa';
import { VOI_CON_BAN_DON } from './voiConBanDon';
import { HAT_BI_CUA_BE_SU } from './hatBiCuaBeSu';
import { CANH_DIEU_CUA_NA } from './canhDieuCuaNa';
import { RUA_CON_RA_BIEN } from './ruaConRaBien';

export const STORY_SCENES: Record<string, StoryScenes> = {
  'chu-cuoi': CHU_CUOI,
  'cay-khe': CAY_KHE,
  'coc-kien-troi': COC_KIEN_TROI,
  'mai-an-tiem': MAI_AN_TIEM,
  'tam-cam': TAM_CAM,
  'banh-chung-banh-giay': BANH_CHUNG_BANH_GIAY,
  'tich-chu': TICH_CHU,
  'son-tinh-thuy-tinh': SON_TINH_THUY_TINH,
  'thanh-giong': THANH_GIONG,
  'ho-guom': HO_GUOM,
  'so-dua': SO_DUA,
  'su-tich-trau-cau': SU_TICH_TRAU_CAU,
  'nang-tien-oc': NANG_TIEN_OC,
  'rua-va-tho': RUA_VA_THO,
  'su-tu-va-chuot': SU_TU_VA_CHUOT,
  'qua-va-binh-nuoc': QUA_VA_BINH_NUOC,
  'dom-dom-soi-duong': DOM_DOM_SOI_DUONG,
  'may-nho-lam-mua': MAY_NHO_LAM_MUA,
  'thuyen-giay-dam-sen': THUYEN_GIAY_DAM_SEN,
  'ngoi-sao-be-ti': NGOI_SAO_BE_TI,
  'ech-con-hat-ru': ECH_CON_HAT_RU,
  'den-ong-sao-cua-ba': DEN_ONG_SAO_CUA_BA,
  'voi-con-ban-don': VOI_CON_BAN_DON,
  'hat-bi-cua-be-su': HAT_BI_CUA_BE_SU,
  'canh-dieu-cua-na': CANH_DIEU_CUA_NA,
  'rua-con-ra-bien': RUA_CON_RA_BIEN,
};
