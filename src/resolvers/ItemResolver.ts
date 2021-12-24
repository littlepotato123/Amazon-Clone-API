import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { Item } from "../entity/Item";

@InputType()
class CreateItemInput {
    @Field()
    name: string;

    @Field(() => Int)
    price: number

    @Field()
    tags: string;

    @Field()
    key: string;
}

@InputType()
class DeleteItemInput {
    @Field()
    key: string;

    @Field()
    name: string;
}

@Resolver()
export class ItemResolver {
    @Query(() => [Item!])
    async all_items() {
        const all = await Item.find();
        return all;
    }

    @Mutation(() => Boolean)
    async delete_item(@Arg("delete", () => DeleteItemInput) del: DeleteItemInput) {
        if(del.key == "KEY") {
            await Item.delete({
                name: del.name
            });
            return true;
        } else {
            return false;
        }
    }

    @Mutation(() => Boolean)
    async create_item(@Arg("create", () => CreateItemInput) create: CreateItemInput) {
        if(create.key == "KEY") {
            const item = await Item.create({
                name: create.name,
                bought_count: 0,
                price: create.price,
                tags: create.tags
            }).save()
            if(item) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}