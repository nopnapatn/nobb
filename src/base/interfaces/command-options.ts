import Category from "../enums/category"

export default interface ICommandOptions {
  name: string
  description: string
  category: Category
  options: object
  default_member_permissions: bigint
  dm_permission: boolean
  cooldown: number
  dev: boolean
}
