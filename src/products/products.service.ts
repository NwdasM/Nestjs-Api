import { Injectable, NotFoundException } from '@nestjs/common';
import { stringify } from 'querystring';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductServise {
    private products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {

    }


    async insertProduct(title: string, description: string, price: number) {
        const newProduct = new this.productModel({ title, description:description, price });
        const result = await newProduct.save();
        return result.id as string;
    }
    async getProducts() {
        const products = await this.productModel.find();
        return products.map((prod) => ({ id: prod.id, title: prod.title, descreiption: prod.description, price: prod.price }));
    }
    async getSingleProduct(productId: string) {
        const product = await this.findProduct(productId);
        return { id: product.id, title: product.title, description: product.description, price: product.price };
    }
    async updateProduct(productId: string, title: string, description: string, price: number) {
        const updateProduct = await this.findProduct(productId);
        if (title) {
            updateProduct.title = title;
        }
        if (description) {
            updateProduct.description = description;
        }
        if (price) {
            updateProduct.price = price;
        }
        updateProduct.save();
    }

    async deleteProduct(prodId: string) {
        await this.productModel.deleteOne({ _id: prodId }).exec();

    }

    private async findProduct(id: string): Promise<Product> {
        let product
        try {
            product = await this.productModel.findById(id);
        } catch (error) {
            throw new NotFoundException('Could not find product.');
        }

        if (!product) {
            throw new NotFoundException('Could not find product.');
        }
        return product;
    }

}