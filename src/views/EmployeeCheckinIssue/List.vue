<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'CheckinIssueList',
    data(){
        return {
          employee_data: {},
          my_checkin_issues: [],
          reports_to_checkin_issues: [],
        }
    },
    mounted(){
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.status_map = {
        "Pending": "bg-warning",
        "Approved": "bg-success",
        "Rejected": "bg-danger",
        "Canceled": "bg-dark"
      };
      this.getData()
    },
    components: {
      Header,
      Footer
    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.employee_checkin_issue.get_checkin_issue_list",
        {employee_id: this.employee_data.employee_id}, 'POST').then(res=>{
          if (res.status_code == 200){
            this.my_checkin_issues = res.data.my_checkin_issues;
            this.reports_to_checkin_issues = res.data.reports_to_issues;
          } else {
            this.notify.error('Error', res.message)
          }
        })
      },
      viewDetails(issue_id){
        this.$router.push({ path: `/checkin-issue/${issue_id}` })
      }
    }
}

</script>

<template>
  <Header />
    <div id="appCapsule">
      <ul class="nav nav-pills nav-justified justify-content-center p-1" id="myTab" role="tablist" style="color:white;">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="self-tab"  data-bs-toggle="pill" data-bs-target="#employee_leave" type="button" role="tab" aria-controls="employee_leave" aria-selected="true">My Checkin Issue</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="approver-tab" data-bs-toggle="pill" data-bs-target="#approver_leave" type="button" role="tab" aria-controls="approver_leave" aria-selected="false">Reports To</button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="employee_leave" role="tabpanel" aria-labelledby="self-tab">
          <ul class="listview inset mb-2">
              <li v-for="(items, idx) in my_checkin_issues">
                <div class="d-flex flex-column" @click="viewDetails(items.name)" style="width: 100vw">
                  <div class="d-inline-flex justify-content-between">
                    <h4 style="color:#B87852">{{items.employee_name}}</h4>
                    <h4 class="fw-bold" style="color:#B87852">{{items.log_type}}</h4>
                  </div>
                  <div class="d-flex flex-row">
                    <div class="flex-column flex-grow-1">
                      <h4 class="fw-light">{{items.issue_type}}</h4>
                      <h4 class="fw-light">{{new Date(items.date).toDateString()}}</h4>  
                    </div>
                    <div class="align-self-center">
                      <div class="badge rounded-pill" :class="this.status_map[items.workflow_state]">{{items.workflow_state}}</div> 
                    </div>
                  </div>
                </div>
              </li>
          </ul>
        </div>


        <div class="tab-pane fade show" id="approver_leave" role="tabpanel" aria-labelledby="approver-tab">
          <div v-if="reports_to_checkin_issues === []">
            <h1>No Records Found</h1>
          </div>
          <div v-else>
            <ul class="listview inset mb-2">
              <li v-for="(items, idx) in reports_to_checkin_issues">
                <div class="d-flex flex-column" @click="viewDetails(items.name)" style="width: 100vw">
                  <div class="d-inline-flex justify-content-between">
                    <h4 style="color:#B87852">{{items.employee_name}}</h4>
                    <h4 class="fw-bold" style="color:#B87852">{{items.log_type}}</h4>
                  </div>
                  <div class="d-flex flex-row">
                    <div class="flex-column flex-grow-1">
                      <h4 class="fw-light">{{items.issue_type}}</h4>
                      <h4 class="fw-light">{{new Date(items.date).toDateString()}}</h4>  
                    </div>
                    <div class="align-self-center">
                      <div class="badge rounded-pill" :class="this.status_map[items.workflow_state]">{{items.workflow_state}}</div> 
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  <Footer />
</template>
