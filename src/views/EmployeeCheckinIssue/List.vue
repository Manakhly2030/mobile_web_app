<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'CheckinIssueList',
    data(){
        return {
          employee_data: {},
          employee_checkin_issue: [],
        }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getData()
    },
    components: {
      Header,
      Footer
    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.employee_checkin_issue.list_employee_checkin_issue",{employee_id: this.employee_data.employee_id}, 'POST').then(res=>{
          if (res.status_code == 200){
            this.employee_checkin_issue = res.data
          } else {
            console.log(res)
            this.notify.error('Error', res.message)
          }
        })
      },
      viewDetails(eci_id){
        this.$router.push({ path: `/checkin-issue-details/${eci_id}` })
      }
    }
}

</script>

<template>
  <!-- Header Start -->
  <Header />
  <!-- Header End -->

  <!-- Body Start -->
    <!-- App Capsule -->
    <div id="appCapsule">

      <ul class="nav nav-pills justify-content-center Danger" id="myTab" role="tablist" style="color:white;">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="self-tab"  data-bs-toggle="pill" data-bs-target="#employee_leave" type="button" role="tab" aria-controls="employee_leave" aria-selected="true">My Checkin Issue</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="approver-tab" data-bs-toggle="pill" data-bs-target="#approver_leave" type="button" role="tab" aria-controls="approver_leave" aria-selected="false">Reports To</button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
     <!-- Transactions -->
          <div class="tab-pane fade show active" id="employee_leave" role="tabpanel" aria-labelledby="self-tab">
              <div class="section mt-4">
                  <ul class="listview inset">
                      <li v-for="(items, idx) in employee_checkin_issue">
                        <div class="item" style="width: 100vw">
                              <div class="in">
                                <h3 @click="viewDetails(items.name)" style="color:#B87852">{{items.name}}</h3>
                                  <div style="display:flex">
                                    <h5 > {{items.issue_type}}</h5> <h5 style="margin-left: auto;">{{items.log_type}}</h5>
                                  </div>
                                  <div style="display:flex">
                                    <h5> {{items.date}}</h5> <h5 style="margin-left: auto;">{{items.workflow_state}}</h5> 
                                  </div>
                               </div>
                          </div>
                      </li>
                  </ul>
                </div>
          </div>


          <!-- <div class="tab-pane fade show" id="approver_leave" role="tabpanel" aria-labelledby="approver-tab">
              <div class="section mt-4">
                <div v-if="approver_leave_application === []">
                  <h1>No Records Found</h1>
                </div>
                <div v-else>
                  <ul class="listview inset">
                      <li v-for="(items, idx) in approver_leave_application">
                        <div class="item" style="width: 100vw">
                              <div class="in">
                                <h3 @click="viewDetails(items.name)" style="color:#B87852">{{items.name}}</h3>
                                  <div style="display:flex">
                                    <h5 > {{items.leave_type}}</h5> <h5 style="margin-left: auto;">{{items.total_leave_days}}</h5>
                                  </div>
                                  <div style="display:flex">
                                    <h5> {{items.from_date}}</h5> <h5 style="margin-left: auto;">{{items.status}}</h5> 
                                  </div>
                               </div>
                          </div>
                      </li>
                  </ul>
                </div>
                </div>
          </div> -->
    </div>
      <!-- * Transactions -->


      </div>
      <!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>
