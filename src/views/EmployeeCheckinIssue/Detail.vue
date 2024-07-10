<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'CheckinIssueDetail',
    data(){
        return {
            employee_data: {},
            name:"",
            employee_name: "",
            date: "",
            log_type: "",
            latitude: 0.00,
            longitude: 0.00,
            issue_type: "",
            shift_supervisor: "",
            workflow_state: "",
            status_map: {
                "Pending": "bg-warning",
                "Approved": "bg-success",
                "Rejected": "bg-danger",
                "Canceled": "bg-dark"
            }
        }
    },
    mounted(){
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getData();
    },
    components: {
      Header,
      Footer
    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.employee_checkin_issue.employee_checkin_issue_details",
        {employee_id: this.employee_data.employee_id, employee_checkin_issue_id: this.$route.params.checkin_issue_id}, 'POST').then(res=>{
          if (res.message != "Resource Not Found"){
            this.name = this.$route.params.checkin_issue_id
            this.status = res.data.workflow_state;
            this.employee = res.data.employee;
            this.employee_name = res.data.employee_name;
            this.shift_supervisor = res.data.shift_supervisor;
            this.date = res.data.date;
            this.issue_type = res.data.issue_type;
            this.latitude = res.data.latitude;
            this.longitude = res.data.longitude;
            this.log_type = res.data.log_type;
            this.workflow_state = res.data.workflow_state;
            if(this.latitude && this.longitude){
                this.load_gmap(this.latitude, this.longitude);
            }
          }
        })
      },
      takeAction(method, status){
        this.frappe.customApiCall(method, { 
            employee_id: this.employee_data.employee_id, 
            employee_checkin_issue_id: this.name}, 'POST').then(res=>{
                if(res.message == "Success"){
                    this.notify.success("Success", `Checkin Issue ${status}`)
                    window.location.reload();
                }
                else{
                    this.notify.error("Error", 'There was an error while taking action on checkin issue.')
                }
          })
      },
      load_gmap(latitude, longitude){
            var map = new google.maps.Map(document.getElementById('map_home'), {
                zoom: 17,
                center: {lat: latitude, lng: longitude},
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true
            });

            // Set user's current location on the map
            let userLat = latitude;
            let userLng = longitude;
            const svgMarker = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: "blue",
                fillOpacity: 0.6,
                strokeWeight: 0,
                rotation: 0,
                scale: 7,
            };
            let marker = new google.maps.Marker({
                map: map,
                title: "Your location",
                icon: svgMarker,
                position: new google.maps.LatLng(userLat, userLng)
            });
        },

    }
}

</script>

<template>
  <Header />
    <div id="appCapsule">
        <div class="m-2 detail_card">
            <div class="d-flex justify-content-center">
                <h3 style="color:#B87852">{{this.name}}</h3>
            </div>
            <table class="table table-striped mt-0">
                <tbody>
                    <tr>
                        <td>Employee: </td>
                        <td>{{ this.employee }}</td>
                    </tr>
                    <tr>
                        <td>Employee Name:</td>
                        <td>{{ this.employee_name }}</td>
                    </tr>
                    <tr>
                        <td>Issue Type</td>
                        <td>{{ this.issue_type }}</td>
                    </tr>
                    <tr>
                        <td>Log Type</td>
                        <td class="fw-bold">{{ this.log_type }}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>{{ new Date(this.date).toDateString() }}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td>
                            <div class="badge rounded-pill" :class="this.status_map[this.workflow_state]">
                                {{ this.workflow_state }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-show="this.latitude > 0 && this.longitude > 0" id="map_home" style="height:300px">
            </div>
        </div>
        <div v-if="this.shift_supervisor === this.employee_data.name && this.status === 'Pending'" class="d-flex gap-2 mx-2">
            <button class="flex-fill btn btn-outline-success" v-on:click="takeAction(`api/method/one_fm.api.v1.employee_checkin_issue.approve_employee_checkin_issue`, `Approved`)"> Approve </button>
            <button class="flex-fill btn btn-outline-danger"  v-on:click="takeAction(`api/method/one_fm.api.v1.employee_checkin_issue.reject_employee_checkin_issue`, `Rejected`)"> Reject</button>
        </div>
        
    </div>
  <Footer />
</template>
