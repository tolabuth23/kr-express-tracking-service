import { StatusEnum } from '../enum/status.enum'
import { UnitEnum } from '../enum/unit.enum'
import { ValueEnum } from '../enum/value.enum'
import { IImportRate } from '../interfaces/import-rate.interface'

export const importRateInitData: IImportRate[] = [
  {
    name: 'สินค้าทั่วไป',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 250,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 300,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 350,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 450,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 250,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 300,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 350,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 450,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
  {
    name: 'สินค้ามือสองใช้แล้ว-โมเดล ฟิกเกอร์-เสื้อผ้ามือสอง(ไม่แบรนด์เนม)',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 180,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 200,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 220,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 240,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 180,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 200,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 220,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 240,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
  {
    name: 'เครื่องสำอางค์-อาหารเสริม-ขนม-สินค้าสุขภาพ-อะไหล่รถยนต์-มอเตอร์ไซค์-เครื่องดนตรี',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 260,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 270,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 280,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 290,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 260,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 270,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 280,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 290,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
  {
    name: 'ล้อแม็ก + ยาง (เส้น)',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 1400,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1800,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2500,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 1400,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1800,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2500,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
  {
    name: 'ล้อแม็ก + ยาง (เซ็ต)',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 5000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 5000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 10000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 20000,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 5000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 5000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 10000,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 20000,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
  {
    name: 'จักรยานมือ 1 แบรนด์เนม',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 2200,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 2500,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2700,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2900,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 2200,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 2500,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 2700,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 2900,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
  {
    name: 'จักรยานมือ 2',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 1250,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1500,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 1750,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 3000,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 1250,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 1500,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 1750,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 3000,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
  {
    name: 'สินค้าแบรนด์เนม เสื้อผ้า กระเป๋า รองเท้า',
    value: {
      [ValueEnum.USER]: [
        {
          min: 0,
          max: 50,
          rate: 450,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 550,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 600,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 700,
          type: UnitEnum.KILOGRAM,
        },
      ],
      [ValueEnum.DEALER]: [
        {
          min: 0,
          max: 50,
          rate: 450,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 51,
          max: 99,
          rate: 550,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 100,
          max: 199,
          rate: 600,
          type: UnitEnum.KILOGRAM,
        },
        {
          min: 200,
          max: null,
          rate: 700,
          type: UnitEnum.KILOGRAM,
        },
      ],
    },
    status: StatusEnum.ACTIVE,
  },
]
