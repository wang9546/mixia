const app = getApp();
const db = require('../../../utils/db');

const HOURS = [];
for (let i = 6; i <= 22; i++) {
  HOURS.push({
    value: i,
    label: `${i}:00`
  });
}

Page({
  data: {
    currentDate: '',
    currentType: '',
    staffTypes: [],
    hours: HOURS,
    scheduleData: [],
    loading: true,
    showTaskModal: false,
    isEdit: false,
    selectedStaffIndex: 0,
    taskTitle: '',
    taskRemark: '',
    startHourIndex: 0,
    endHourIndex: 1,
    taskStatus: 'booked',
    editingTaskId: null,
    editingStaffId: null
  },

  onLoad() {
    const today = new Date();
    const dateStr = this.formatDate(today);
    this.setData({ currentDate: dateStr });
    this.loadStaffTypes();
    this.loadSchedule();
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getDisplayDate() {
    const { currentDate } = this.data;
    const date = new Date(currentDate);
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekDays[date.getDay()];
  },

  async loadStaffTypes() {
    try {
      const { types } = await db.getServiceConfigs('staff');
      this.setData({ 
        staffTypes: [{ _id: '', name: '全部' }, ...types]
      });
    } catch (err) {
      console.error('加载人员类型失败:', err);
    }
  },

  async loadSchedule() {
    this.setData({ loading: true });
    
    try {
      const { list } = await db.getServiceList('staff', { pageSize: 100 });
      
      const scheduleData = list.map(staff => {
        const { tasks, maxRow } = this.arrangeTasksInRows(staff.tasks || []);
        return {
          ...staff,
          tasks,
          taskRows: maxRow || 1
        };
      });
      
      this.setData({
        scheduleData,
        loading: false
      });
    } catch (err) {
      console.error('加载档期失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  arrangeTasksInRows(tasks) {
    if (!tasks || tasks.length === 0) return { tasks: [], maxRow: 0 };
    
    const sortedTasks = [...tasks].sort((a, b) => a.startHour - b.startHour);
    const rows = [];
    
    sortedTasks.forEach(task => {
      let placed = false;
      
      for (let i = 0; i < rows.length; i++) {
        const lastTaskInRow = rows[i][rows[i].length - 1];
        if (task.startHour >= lastTaskInRow.endHour) {
          rows[i].push({ ...task, row: i });
          placed = true;
          break;
        }
      }
      
      if (!placed) {
        rows.push([{ ...task, row: rows.length }]);
      }
    });
    
    const arrangedTasks = rows.flat().sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.startHour - b.startHour;
    });
    
    return { 
      tasks: arrangedTasks, 
      maxRow: rows.length 
    };
  },

  getTypeName(type) {
    const typeMap = {
      'emcee': '司仪',
      'makeup': '化妆师',
      'photographer': '摄影师',
      'videographer': '摄像师'
    };
    return typeMap[type] || type;
  },

  onPrevDay() {
    const current = new Date(this.data.currentDate);
    current.setDate(current.getDate() - 1);
    this.setData({ currentDate: this.formatDate(current) });
    this.loadSchedule();
  },

  onNextDay() {
    const current = new Date(this.data.currentDate);
    current.setDate(current.getDate() + 1);
    this.setData({ currentDate: this.formatDate(current) });
    this.loadSchedule();
  },

  onDateChange(e) {
    this.setData({ currentDate: e.detail.value });
    this.loadSchedule();
  },

  onTypeChange(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ currentType: id });
    this.loadSchedule();
  },

  onAddTask() {
    this.setData({
      showTaskModal: true,
      isEdit: false,
      selectedStaffIndex: 0,
      taskTitle: '',
      taskRemark: '',
      startHourIndex: 0,
      endHourIndex: 1,
      taskStatus: 'booked',
      editingTaskId: null,
      editingStaffId: null
    });
  },

  onTaskTap(e) {
    const { task, staff } = e.currentTarget.dataset;
    const staffIndex = this.data.scheduleData.findIndex(s => s._id === staff._id);
    
    this.setData({
      showTaskModal: true,
      isEdit: true,
      selectedStaffIndex: staffIndex,
      taskTitle: task.title,
      taskRemark: task.remark || '',
      startHourIndex: task.startHour - 6,
      endHourIndex: task.endHour - 6,
      taskStatus: task.status,
      editingTaskId: task.id,
      editingStaffId: staff._id
    });
  },

  closeTaskModal() {
    this.setData({ showTaskModal: false });
  },

  stopPropagation() {
    // 阻止事件冒泡的空函数
  },

  onStaffChange(e) {
    this.setData({ selectedStaffIndex: parseInt(e.detail.value) });
  },

  onTaskTitleInput(e) {
    this.setData({ taskTitle: e.detail.value });
  },

  onTaskRemarkInput(e) {
    this.setData({ taskRemark: e.detail.value });
  },

  onStartHourChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 
      startHourIndex: index,
      endHourIndex: Math.max(index + 1, this.data.endHourIndex)
    });
  },

  onEndHourChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 
      endHourIndex: index,
      startHourIndex: Math.min(index - 1, this.data.startHourIndex)
    });
  },

  onTaskStatusChange(e) {
    this.setData({ taskStatus: e.detail.value });
  },

  async onSaveTask() {
    const {
      isEdit,
      selectedStaffIndex,
      taskTitle,
      taskRemark,
      startHourIndex,
      endHourIndex,
      taskStatus,
      editingTaskId,
      scheduleData
    } = this.data;

    if (!taskTitle.trim()) {
      wx.showToast({ title: '请输入任务项', icon: 'none' });
      return;
    }

    const startHour = startHourIndex + 6;
    const endHour = endHourIndex + 6;

    if (startHour >= endHour) {
      wx.showToast({ title: '结束时间必须大于开始时间', icon: 'none' });
      return;
    }

    const staff = scheduleData[selectedStaffIndex];
    const rawTasks = staff.tasks.map(t => {
      const { row, ...rest } = t;
      return rest;
    });
    
    const newTask = {
      id: isEdit ? editingTaskId : `task_${Date.now()}`,
      title: taskTitle,
      remark: taskRemark,
      startHour,
      endHour,
      status: taskStatus
    };

    let updatedTasks;
    if (isEdit) {
      updatedTasks = rawTasks.map(t => t.id === editingTaskId ? newTask : t);
    } else {
      updatedTasks = [...rawTasks, newTask];
    }

    try {
      await db.updateStaff(staff._id, { tasks: updatedTasks });
      
      const { tasks, maxRow } = this.arrangeTasksInRows(updatedTasks);
      scheduleData[selectedStaffIndex] = {
        ...staff,
        tasks,
        taskRows: maxRow || 1
      };
      
      this.setData({ scheduleData });
      this.closeTaskModal();
      wx.showToast({ title: isEdit ? '编辑成功' : '添加成功', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onDeleteTask() {
    const { selectedStaffIndex, editingTaskId, scheduleData } = this.data;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      success: async (res) => {
        if (res.confirm) {
          const staff = scheduleData[selectedStaffIndex];
          const rawTasks = staff.tasks.map(t => {
            const { row, ...rest } = t;
            return rest;
          });
          const updatedTasks = rawTasks.filter(t => t.id !== editingTaskId);
          
          try {
            await db.updateStaff(staff._id, { tasks: updatedTasks });
            
            const { tasks, maxRow } = this.arrangeTasksInRows(updatedTasks);
            scheduleData[selectedStaffIndex] = {
              ...staff,
              tasks,
              taskRows: maxRow || 1
            };
            
            this.setData({ scheduleData });
            this.closeTaskModal();
            wx.showToast({ title: '删除成功', icon: 'success' });
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  }
});
