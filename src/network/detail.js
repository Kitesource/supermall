import { request } from './request'

export function getDetail(iid) {
    return request({
        url: 'detail',
        params: {
            iid
        }
    })
}

export function getRecommend() {
    return request({
        url: '/recommend'
    })
}

export class Goods {
    constructor(itemInfol,  columns, services) {
        this.title = itemInfol.title
        this.desc = itemInfol.desc
        this.newPrice = itemInfol.price
        this.oldPrice = itemInfol.oldPrice
        this.discount = itemInfol.discountDesc
        this.columns = columns
        this.services = services
        this.realPrice = itemInfol.lowNowPrice
    }
}

export class Shop {
    constructor(shopInfo) {
        this.logo = shopInfo.shopLogo
        this.name = shopInfo.name
        this.fans = shopInfo.cFans
        this.sells = shopInfo.cSells
        this.score = shopInfo.score
        this.goodsCount = shopInfo.cGoods
    }
}

export class GoodsParam {
    constructor(info, rule) {
      this.image = info.images ? info.images[0] : "";
      this.infos = info.set;
      this.sizes = rule.tables;
    }
  }