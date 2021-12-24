import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Item } from "../entity/Item";
import { User } from "../entity/User";

@InputType()
class DeleteItem {
    @Field()
    user_id: string;

    @Field()
    item_name: string;
}

@InputType()
class AddItem {
    @Field()
    user_id: string;
    
    @Field()
    item_id: string;
}

@InputType()
class BuyItem {
    @Field()
    user_id: string;
};

@Resolver()
export class CartResolver {
    @Mutation(() => Boolean)
    async add_cart(@Arg("add", () => AddItem) add: AddItem) {
        const item = await Item.findOne({
            where: {
                id: add.item_id
            }
        });
        const cur_user = await User.findOne({where: {
            id: add.user_id
        }});
        if(item && cur_user) {
            let current = cur_user.current;
            current += `,${item.name}`

            await User.update(cur_user.id, {
                current
            });

            return true;
        } else {
            return false;
        }
    }

    @Mutation(() => Boolean) 
    async buy(@Arg("buy", () => BuyItem) buy: BuyItem) {
        const user = await User.findOne({
            where: {
                id: buy.user_id
            }
        });

        if(user) {
            let current = user.current;
            let current_list = current.split(',');

            for(let i = 0; i < current_list.length; i++) {
                let item = await Item.findOne({
                    where: {
                        name: current_list[i]
                    }
                });
                if(item) {
                    let count = item.bought_count;
                    count += 1;
                    await Item.update(item.id, {
                        bought_count: count 
                    });
                }
            }

            let bought = user.bought;
            bought += current;

            await User.update(user.id, {
                current: "",
                bought
            });

            return true;
        } else {
            return false;
        }
    }

    @Query(() => String)
    async current_cart(@Arg("id", () => String) id: string) {
        const user = await User.findOne({
            where: {
                id
            }
        });
        if(user) {
            return user.current;
        } else {
            return "";
        }
    }

    @Mutation(() => Boolean)
    async delete_cart(@Arg("del", () => DeleteItem) del: DeleteItem) {
        const user = await User.findOne({ 
            where: {
                id: del.user_id
            }
        });
        if(user) {
            const current = user.current;
            const broken = current.split(',');
            console.log(broken);
            const index = broken.findIndex((i) => i === del.item_name);
            broken.splice(index, 1);
            console.log(broken);
            const new_current = broken.join(',');
            await User.update(user.id, {
                current: new_current
            });
            return true;
        } else {
            return false;
        }
    }
}