const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  gender: state => state.user.gender,
  name: state => state.user.name,
  roles: state => state.user.roles,
  users: state => state.rbac.users
}
export default getters
