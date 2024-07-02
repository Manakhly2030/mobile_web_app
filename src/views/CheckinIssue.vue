<script>
export default{
    'name': 'CheckinIssue',
    data() {
        return {
        employee_data: {},
        issueTypes: [],
        selectedIssueType: '',
        issueDetails: '',
        };
    },
    mounted() {
    this.is_logged_in();
    this.loader.end();
    this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
    this.initialize();
  },


    methods: {
        initialize() {
                let me = this;
                me.frappe.customApiCall(`api/method/one_fm.api.v1.employee_checkin_issue.get_issue_type`,
                {}, 'GET').then(res=>{
                    if (res.status_code === 200) {
                        this.issueTypes = res.data;
                    } else {
                        console.error('Failed to fetch issue types:', res.message);
                    }
                })
        },
        getCurrentDate() {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
        },
        submit_checkin_issue(){
            const formattedDate = this.getCurrentDate();
            this.frappe.customApiCall(`api/method/one_fm.api.v1.employee_checkin_issue.create_employee_checkin_issue`,
                {
                    employee_id: this.employee_data.employee_id,
                    issue_type: this.selectedIssueType,
                    issue_details: this.issueDetails,
                    date: formattedDate,
                    latitude: this.$route.params.latitude,
                    longitude :this.$route.params.longitude,
                    log_type : this.$route.params.log_type,
                }, 'POST').then(res=>{
                    const route = (res.status_code === 201) ? '/home' : '/checkin';
                    if (res.status_code === 201) {
                        this.notify.success("Checkin Issue Created Successfuly", )
                        const route = '/home'
                    } else {
                        console.log(res.error)
                        this.notify.error(res.error,)
                        const route = '/checkin'
                    }
                    this.$router.push(route);
                    setTimeout(()=>{window.location.href=route}, 5000)
                })
                
        }
    }
}
   


</script>


<template>
    <!-- Header Start -->
    <Header />
    <!-- Header End -->
  
    <div class="container">
      <form id="issue-form" @submit.prevent="submit_checkin_issue">
        <label for="issue-type" class="issue-label">Issue Type:</label>
        <select id="issue-type" v-model="selectedIssueType" @change="toggleIssueDetails" class="form-field">
          <option v-for="option in issueTypes" :key="option" :value="option">{{ option }}</option>
        </select>
        <br><br>
        <div v-if="selectedIssueType === 'Other'" id="issue-details-container">
          <label for="issue-details" class="issue-label">Issue Details:</label>
          <input type="text" id="issue-details" name="issue_details" v-model="issueDetails" class="form-field">
        </div>
        <br><br>
        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>
  
    <!-- Footer Start -->
    <Footer />
    <!-- Footer End -->
</template>
  
<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  #issue-form {
    background-color: transparent;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-field {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    margin-top: 8px;
    margin-bottom: 16px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
    .submit-button {
        background-color: #B87852;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        align-self: end;
    }

    .issue-label{
        color: white;
    }



  </style>
  