// const CurrentTeam = 'CurrentTeamId';
// import TeamService from "./TeamService";
// import Vue from 'vue';
// import { filter } from 'lodash';

// export function GetCurrentTeam() {
//   return new Promise(function (resolve, reject) {
//     let currentTeam = localStorage.getItem(CurrentTeam);
//     //console.log('current team ', currentTeam)
//     if (currentTeam == null) {
//       console.log('asking server')
//       TeamService.getTeams().then((res) => {

//         // setting current team if no team has been chosen
//         if (!localStorage.getItem(CurrentTeam))
//           localStorage.setItem(CurrentTeam, res[0].teamId)
//         console.log('commiting')
//         // setting current team
//         resolve(localStorage.getItem(CurrentTeam));
//       },
//         f => reject);
//     }
//     else {
//       resolve(currentTeam);
//     }
//   })

// }

// export function SetCurrentTeam(teamId) {
//   localStorage.setItem(CurrentTeam, teamId)
// }

// export function ClearCurrentTeam() {
//   localStorage.removeItem(CurrentTeam);
// }

// // Team Permissions

// //owner
// // -- owner + all below 
// //admin 
// // -- changeteam + all below 
// // super 
// // -- changestatus + all below 
// //member 
// // -- viewall
// // -- member

// // ( view all might move to super rather than member )

// function CheckPermission(permission, resolve) {

//   GetCurrentTeam().then(currentTeamId => {

//     //TODO change Authentication mixin to a service 
//     // let Auth = new Vue({ mixins: [authMixin] });
//     Auth.getProfile(user => {
//       let roles = user.role;
//       if (roles.constructor !== Array) {
//         roles = [roles];
//       }

//       let result = filter(roles, r => {
//         var parts = r.split(":");
//         if (parts.length == 2) {
//           if (parts[1] === currentTeamId) {

//             if (parts[0] === "owner") {
//               return true;
//             }

//             if (parts[0] === permission) {
//               return true;
//             }
//           }
//         }
//       })

//       if (result.length > 0) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     })
//   })
// }

// export function IsOwner() {
//   return new Promise(function (resolve) {
//     CheckPermission('owner', resolve);
//   })
// }

// export function CanChangeTeam() {
//   return new Promise(function (resolve) {
//     CheckPermission('changeteam', resolve);
//   })
// }

// export function CanChangeAllActionStatus() {
//   return new Promise(function (resolve) {
//     CheckPermission('changestatus', resolve);
//   })
// }

// export function CanViewAllActions() {
//   return new Promise(function (resolve) {
//     CheckPermission('viewall', resolve);
//   })
// }

// export default {
//   GetCurrentTeam,
//   SetCurrentTeam,
//   ClearCurrentTeam,
//   IsOwner,
//   CanChangeTeam,
//   CanChangeAllActionStatus,
//   CanViewAllActions
// }