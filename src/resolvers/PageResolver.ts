import { Arg, Field, InputType, Query, Resolver } from "type-graphql";
import { Item } from "../entity/Item";
import { User } from "../entity/User";
import { Category_List, Company_List } from "../Item_List";

@InputType() 
class PriceRangeInput {
    @Field()
    min: number;

    @Field()
    max: number;
}

@Resolver()
export class PageResolver {
    @Query(() => Item!)
    async object_details(@Arg("id", () => String) id: string) {
        const item = await Item.findOne({
            where: {
                id
            }
        });
        if(item) {
            return item;
        } else {
            return null;
        }
    }

    @Query(() => [Item]!)
    async all_objects() {
        const items = await Item.find();
        if(items) {
            return items;
        } else {
            return null;
        }
    }

    @Query(() => User!)
    async user_details(@Arg("id", () => String) id: string) {
        const user = await User.findOne({
            where: {
                id
            }
        });
        if(user) {
            return user;
        } else {
            return null;
        }
    }

    @Query(() => [String]!)
    async company_list() {
        return Company_List;
    }

    @Query(() => [String]!)
    async category_list() {
        return Category_List;
    }

    @Query(() => [Item])
    async category_item(@Arg("category", () => String) category: string) {
        const items = await Item.find();
        const filtered_items = items.filter((val, _) => {
            return val.tags.includes(category);
        })
        console.log(filtered_items);
        return filtered_items;
    }

    @Query(() => [Item])
    async company_items(@Arg("company", () => String) company: string) {
        const items = await Item.find();
        const filtered_items = items.filter((val, _) => {
            return val.tags.includes(company);
        })
        return filtered_items;
    }

    @Query(() => [Item!])
    async price_items(@Arg("range", () => PriceRangeInput) range: PriceRangeInput) {
        const items = await Item.find();
        const filtered_items = items.filter((val, _) => {
            return val.price > range.min;
        })
        const more = filtered_items.filter((val, _) => {
            return val.price < range.max;
        });
        return more;
    }
}