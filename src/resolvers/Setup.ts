import { Mutation, Resolver } from "type-graphql";
import { Item } from "../entity/Item";
import { Main } from "../entity/Main";
import { User } from "../entity/User";
import { list } from "../Item_List";

@Resolver()
export class Setup {
    @Mutation(() => Boolean)
    async setup() {
        const found = await Item.find();
        if(found) {
            if(found.length > 0) {
                return false;
            } else {
                list.map(async (i) => {
                    await Item.create({
                        name: i.name,
                        price: i.price,
                        bought_count: i.bought_count,
                        tags: i.tags
                    }).save();
                })
                await Main.create({
                    username: "main",
                    password: "secret"
                }).save()
                return true;
            }
        } else {
            return false;
        }
    }

    @Mutation(() => Boolean)
    async delete_all() {
        await Item.delete({});
        await Main.delete({});
        await User.delete({});
        return true;
    }
}