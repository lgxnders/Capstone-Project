from typing import Any


class Resource:
	def __init__(self, resource_id: str, resource_type: str, location: str, data: Any):
		self.id = resource_id
		self.type = resource_type
		self.location = location
		self.data = data