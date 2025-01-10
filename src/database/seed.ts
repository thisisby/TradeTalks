import logger from "../config/logger";
import {User} from "../app/modules/user/user.entity";
import {Roles} from "../app/modules/user/user.enum";
import {CategoryEnum} from "../constants/category.constant";
import {Category} from "../app/modules/category/category.entity";
import {ChatType} from "../app/modules/chat-type/chat-type.entity";
import {Location} from "../app/modules/location/location.entity"
async function seedUsers() {
    const adminPayload = [{
        name: "admin",
        phone: "+70000000000",
        role: Roles.ADMIN
    }]
    try {
        await User.bulkCreate(adminPayload)
        logger.info("admin created")
    } catch (e) {
        logger.info(e)
    }
}

async function seedCategories() {
    const categoryPayload = [
        {
            id: CategoryEnum.PERSONAL,
            name: "Личные",
        },
        {
            id: CategoryEnum.SAVED,
            name: "Сохранённые",
        },
        {
            id: CategoryEnum.SUBSCRIBED,
            name: "Чаты",
        },
    ];
    try {
        await Category.bulkCreate(categoryPayload)
        logger.info("categories created")
    } catch (e) {
        logger.info(e)
    }
}

async function seedChatTypes() {
    const chatTypePayload = [
        {id: 1, title: "Услуги",},
        {id: 2, title: "Такси",},
        {id: 3, title: "Номер", isEditable: true},
        {id: 99999, title: "Без типа"},
    ]
    try {
        await ChatType.bulkCreate(chatTypePayload)
        logger.info("chat-types created")
    } catch (e) {
        logger.info(e)
    }
}

async function seedLocations() {
    const locationPayload = [
        {id: 1, name: "Астана",},
        {id: 2, name: "Алматы",},
        {id: 3, name: "Шымкент",},
        {id: 4, name: "Караганда",},
        {id: 5, name: "Актау",},
        {id: 6, name: "Актобе",},
        {id: 7, name: "Атырау",},
        {id: 8, name: "Тараз",},
        {id: 9, name: "Уральск",},
        {id: 10, name: "Павлодар",},
        {id: 11, name: "Усть-Кмаеногорск",},
        {id: 12, name: "Костанай",},
        {id: 13, name: "Кызылорда",},
        {id: 14, name: "Кокшетау",},
        {id: 15, name: "Талдыкорган",},
        {id: 16, name: "Туркестан",},
        {id: 17, name: "Семей",},
        {id: 18, name: "Петропавлоск",},
        {id: 19, name: "Темиртау",},
        {id: 20, name: "Экибастуз",},
        {id: 21, name: "Жезказган",},
        {id: 22, name: "Капчагай",},
        {id: 23, name: "Балхаш",},
        {id: 24, name: "Аксай",},
        {id: 25, name: "Щучинск",},
        {id: 26, name: "Рудный",},
        {id: 27, name: "Жанаозен",},
        {id: 28, name: "Сатпаев",},
        {id: 29, name: "Кентау",},
        {id: 30, name: "Сарыагаш",},
        {id: 31, name: "Жетысай",},
        {id: 32, name: "Риддер",},
        {id: 33, name: "Каскелен",},
        {id: 34, name: "Кульсары",},
        {id: 35, name: "Степногорск",},
        {id: 36, name: "Талгар",},
        {id: 37, name: "Сарань",},
        {id: 38, name: "Аксу",},
        {id: 39, name: "Зыряновск",},
        {id: 40, name: "Аягоз",},
        {id: 41, name: "Лисаковск",},
        {id: 42, name: "Шу",},
        {id: 43, name: "Байконыр",},
        {id: 44, name: "Шахтинск",},
        {id: 45, name: "Есик",},
        {id: 46, name: "Жаркент",},
        {id: 47, name: "Атбасар",},
        {id: 48, name: "Аральск",},
        {id: 49, name: "Аркалык",},
        {id: 50, name: "Узынагаш",},
        {id: 99999, name: "Без локаций"}
    ]
    try {
        await Location.bulkCreate(locationPayload)
        logger.info("locations created")
    } catch (e) {
        logger.info(e)
    }
}

export {
    seedUsers,
    seedChatTypes,
    seedCategories,
    seedLocations,
}