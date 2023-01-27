import { ImportRateInterface } from '../interfaces/import-rate.interface'
import EValue from '../enum/value.enum'
import EUnit from '../enum/unit.enum'
import EStatus from '../enum/status.enum'

export const importRateInitData: ImportRateInterface[] = [
  {
    name: 'สินค้าทั่วไป',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 250,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 300,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 350,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 450,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 250,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 300,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 350,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 450,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
  {
    name: 'สินค้ามือสองใช้แล้ว-โมเดล ฟิกเกอร์-เสื้อผ้ามือสอง(ไม่แบรนด์เนม)',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 180,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 200,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 220,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 240,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 180,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 200,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 220,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 240,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
  {
    name: 'เครื่องสำอางค์-อาหารเสริม-ขนม-สินค้าสุขภาพ-อะไหล่รถยนต์-มอเตอร์ไซค์-เครื่องดนตรี',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 260,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 270,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 280,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 290,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 260,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 270,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 280,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 290,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
  {
    name: 'ล้อแม็ก + ยาง (เส้น)',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 1400,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1800,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2500,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 1400,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1800,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2500,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
  {
    name: 'ล้อแม็ก + ยาง (เซ็ต)',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 5000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 5000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 10000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 20000,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 5000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 5000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 10000,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 20000,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
  {
    name: 'จักรยานมือ 1 แบรนด์เนม',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 2200,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 2500,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2700,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2900,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 2200,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 2500,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2700,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2900,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
  {
    name: 'จักรยานมือ 2',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 1250,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1500,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 1750,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 3000,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 1250,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1500,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 1750,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 3000,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
  {
    name: 'สินค้าแบรนด์เนม เสื้อผ้า กระเป๋า รองเท้า',
    value: {
      [EValue.USER]: [
        {
          min: 0,
          max: 50,
          rate: 450,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 550,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 600,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 700,
          type: EUnit.KILOGRAM,
        },
      ],
      [EValue.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 450,
          type: EUnit.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 550,
          type: EUnit.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 600,
          type: EUnit.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 700,
          type: EUnit.KILOGRAM,
        },
      ],
    },
    status: EStatus.ACTIVE,
  },
]
