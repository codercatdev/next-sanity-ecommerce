import product from '../../schemas/product'
import collection from '../../schemas/collection'
import price from '../../schemas/price'
import {cart} from '../../schemas/cart'
import {stripeSession} from '../../schemas/stripeSession'

export const schemaTypes = [product, collection, price, cart, stripeSession]