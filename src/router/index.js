import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/authentication/Login.vue'
import Home from '@/views/Home.vue'
import Checkin from '@/views/Checkin.vue'
import CheckinIssue from '@/views/EmployeeCheckinIssue/Create.vue'
import CheckinIssueDetail from '@/views/EmployeeCheckinIssue/Detail.vue'
import CheckinIssueList from '@/views/EmployeeCheckinIssue/List.vue'
import CheckinIssueDetails from '@/views/EmployeeCheckinIssue/Detail.vue'
import CheckinHistory from '@/views/CheckinHistory.vue'
import Notification from '@/views/Notification.vue'
import ApplyLeaveApplication from '@/views/Leave_Application/Create.vue'
import ViewLeaveApplication from '@/views/Leave_Application/View.vue'
import LeaveApplicationDetails from '@/views/Leave_Application/Detail.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import  ShiftPermissionList from '@/views/shift_permission/ShiftPermission.vue'
import  ShiftPermissionDetail from '@/views/shift_permission/ShiftPermissionDetail.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login},
    { path: '/home', name: 'home', component: Home},
    { path: '/checkin', name: 'checkin', component: Checkin},
    { path: '/checkin_history', name: 'checkin_history', component: CheckinHistory},
    { path: '/checkin-issue/', name: 'checkin_issue_list', component: CheckinIssueList},
    { path: '/checkin-issue/:checkin_issue_id', name: 'checkin_issue_detail', component: CheckinIssueDetail},
    { path: '/checkin-issue/:latitude/:longitude/:log_type', name: 'checkin_issue', component: CheckinIssue},
    { path: '/shift_permission_list', name: 'shift_permission_list', component: ShiftPermissionList},
    { path: '/shift_permission/:id', name: 'shift_permission', component: ShiftPermissionDetail},
    { path: '/shift_permission/', name: 'new_shift_permission', component: ShiftPermissionDetail},
    { path: '/notification', name: 'notification', component: Notification},
    { path: '/forgot_password', name: 'forgot_password', component: ForgotPassword},
    { path: '/leave_application/create', name: 'apply_leave_application', component: ApplyLeaveApplication},
    { path: '/leave_application/view', name: 'view_leave_application', component: ViewLeaveApplication},
    { path: '/leave_application/:leave_id', name: 'leave_application_details', component: LeaveApplicationDetails},
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue')},
  ]
})

export default router
